import {GetServerSidePropsContext} from "next";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {SupabaseClient} from "@supabase/supabase-js";
import {Session} from "@supabase/auth-helpers-react";

import {Database} from "./database.types";
import {
    Entity,
    EntityMember,
    EntityType,
    Hub, isLocationEntity,
    LinkDetails,
    LinkType,
    LocationEntity,
    MemberDetails,
    Profile,
    Project,
    RegionAssociations,
    RegionCatalog,
    RegionInfo,
    RegionNode,
    Role,
    RoleKey,
    RolesDictionary,
    UserStatus
} from "./types";
import {en} from "@supabase/auth-ui-react";

type DbLinkInsert = Database['public']['Tables']['links']['Insert']
type DbRelationship = Database['public']['Tables']['relationships']['Row']
type DbEntity = Database['public']['Tables']['entities']['Row']
type DbRole = Database['public']['Tables']['roles']['Row']
type DbEntityMember = {id: string, name: string, description: string, type_id: number, role: string}

export type DbContext = {
    client: SupabaseClient<Database>
    session: Session | null
}

//##########################
// Helper Functions
function createMemberDetails(client: SupabaseClient<Database>, userId: string, username: string, avatarFilename: string, role: string): MemberDetails {
    const member: MemberDetails = {
        userId: userId,
        username: username,
        avatarFilename: avatarFilename,
        roleName: role,
        avatarURL: ''
    }
    if (member.avatarFilename) {
        const urlResult = client.storage.from('avatars').getPublicUrl(member.avatarFilename)
        member.avatarURL = urlResult.data.publicUrl
    }
    return member
}

function createProfile(client: SupabaseClient<Database>, id: string, username: string, avatarFilename: string, status: UserStatus): Profile {
    const p: Profile = {
        status: status,
        id: id,
        username: username,
        avatarFilename: avatarFilename,
        avatarURL: ''
    }
    if (p.avatarFilename) {
        const urlResult = client.storage.from('avatars').getPublicUrl(p.avatarFilename)
        p.avatarURL = urlResult.data.publicUrl
    }
    return p
}

function createEntityMembers(dbRelations: Array<DbEntityMember>): Array<EntityMember> {
    return dbRelations.map((entry) => {
        const member: EntityMember = {
            id: entry.id,
            name: entry.name,
            description: entry.description,
            roleName: entry.role,
            type: entry.type_id
        }
        return member
    })
}

function createEntities(dbEntities: Array<DbEntity>): Array<Entity> {
    return dbEntities.map((entry) => {
        return createEntity(entry)
    })
}

function createEntity(dbEntity: DbEntity): Entity {
    return {
        id: dbEntity.id,
        name: dbEntity.name,
        description: dbEntity.description || '',
        type: dbEntity.type_id
    }

}

export const getServerClient = async (ctx: GetServerSidePropsContext): Promise<DbContext> => {
    const client = createServerSupabaseClient<Database>(ctx)
    const {
        data: {session},
    } = await client.auth.getSession()

    return { client, session }
}

export async function isUserEntityAdmin(client: SupabaseClient<Database>, userId: string, entityId: string): Promise<boolean> {
    const {data, error} = await client.from('relationships').select('roles(name)').match({from_id: userId, to_id: entityId})
    if (error) {
        console.error('Unable to retrieve member relationship for hub ID ' + entityId + ' and user ' + userId + '. Error: ' + error.message)
        return false
    }
    const adminRole = data.find(role => {
        if (role?.roles && !Array.isArray(role.roles) )
            return role.roles.name.toUpperCase() == 'ADMIN';
        return false
    })
    return adminRole !== undefined
}

export async function getProjectsForUser(client: SupabaseClient<Database>, userId: string): Promise<Array<EntityMember>> {
    const {data, error} = await client.rpc('get_entity_target_relations_by_type', {from_id: userId, type_id: EntityType.PROJECT})
    if (error) {
        console.error('Unable to retrieve projects for user ' + userId + '. Error: ' + error.message)
        throw error
    }
    // @ts-ignore
    return data ? createEntityMembers(data as Array<DbEntityMember>) : new Array<EntityMember>()
}

export async function getHubsForUser(client: SupabaseClient<Database>, userId: string): Promise<Array<EntityMember>> {
    const {data, error} = await client.rpc('get_entity_target_relations_by_type', {from_id: userId, type_id: EntityType.HUB})
    if (error) {
        console.error('Unable to retrieve hubs for user ' + userId + '. Error: ' + error.message)
        throw error
    }
    // @ts-ignore
    return data ? createEntityMembers(data as Array<DbEntityMember>) : new Array<EntityMember>()
}

export async function getProjectsForHub(client: SupabaseClient<Database>, hubId: string): Promise<Array<EntityMember>> {
    const {data, error} = await client.rpc('get_entity_source_relations_by_type', {to_id: hubId, type_id: EntityType.PROJECT})
    if (error) {
        console.error('Unable to retrieve projects for hub ID ' + hubId + '. Error: ' + error.message)
        throw error
    }
    // @ts-ignore
    return data ? createEntityMembers(data as Array<DbEntityMember>) : new Array<EntityMember>()
}

export async function getProjectCandidatesForHub(client: SupabaseClient<Database>, hubId: string): Promise<Array<Entity>> {
    const {data, error} = await client.rpc('get_entity_source_candidates_by_type', {to_id: hubId, type_id: EntityType.PROJECT})
    if (error) {
        console.error('Unable to retrieve project candidates for hub ID ' + hubId + '. Error: ' + error.message)
        throw error
    }
    // @ts-ignore
    return data ? createEntities(data as Array<DbEntity>) : new Array<Entity>()
}

async function getRegionInfo(client: SupabaseClient<Database>, regionId: number | string, level: number, tablePrefix: string): Promise<RegionInfo> {
    const tablename = 'get_'+tablePrefix+'_region_info_l'+level
    // @ts-ignore
    const {data, error} = await client.rpc(tablename, {region_id: regionId}).single()
    if (error) {
        console.error('Unable to retrieve region info from table '+tablename+', region ID: ' + regionId + ', level: '+level+'. Error: ' + error.message)
        throw error
    }

    const result = Array<RegionNode>()
    if (data) {
        for (let i=1; i <= level; i++) {
            // @ts-ignore
            result[i-1] = {id: data['l'+i+'_id'], level: i, link: data['l'+i+'_link'], name: data['l'+i+'_name']}
        }
    }
    return result
}

export async function getRegionAssociations(client: SupabaseClient<Database>, ownerId: string): Promise<RegionAssociations> {
    const {data, error} = await client.from('region_associations').select('*').eq('owner_id', ownerId)
    if (error) {
        console.error('Unable to retrieve region associations from owner ID ' + ownerId + '. Error: ' + error.message)
        throw error
    }

    let associations: RegionAssociations = {custom: null, epa: null, oneEarth: null}
    if (data && data.length > 0) {
        // @ts-ignore
        associations.oneEarth = data[0].oe_region_id ? await getRegionInfo(client, data[0].oe_region_id, data[0].oe_level, 'oe') : null,
        // @ts-ignore
        associations.epa = data[0].epa_region_id ? await getRegionInfo(client, data[0].epa_region_id, data[0].epa_level, 'epa') : null,
        // @ts-ignore
        associations.custom = data[0].rl_region_id ? await getRegionInfo(client, data[0].rl_region_id, data[0].rl_level, 'rl') : null
    }
    return associations
}

export async function getOneEarthCatalog(client: SupabaseClient): Promise<RegionCatalog> {
    return getStandardCatalog(client, 'oe', ['Realm','Subrealm','Bioregion','Ecoregion'])
}

export async function getEPACatalog(client: SupabaseClient): Promise<RegionCatalog> {
    return getStandardCatalog(client, 'epa', ['Level I','Level II','Level III','Level IV'])
}

export async function getCustomCatalog(client: SupabaseClient): Promise<RegionCatalog> {
    return getStandardCatalog(client, 'rl', ['Bioregion','Bioregion','Bioregion','Bioregion'])
}

async function getStandardCatalog(client: SupabaseClient<Database>, tablePrefix: string, labels: Array<string>): Promise<RegionCatalog> {
    const result1 = await client.from(tablePrefix+'_regions_1').select('*').order('name')
    if (result1.error) {
        console.error('Unable to retrieve regions level 1 with table prefix: '+tablePrefix+'. Error: ' + result1.error.message)
        throw result1.error
    }
    const result2 = await client.from(tablePrefix+'_regions_2').select('*').order('name')
    if (result2.error) {
        console.error('Unable to retrieve regions level 2 with table prefix: '+tablePrefix+'. Error: ' + result2.error.message)
        throw result2.error
    }
    const result3 = await client.from(tablePrefix+'_regions_3').select('*').order('name')
    if (result3.error) {
        console.error('Unable to retrieve regions level 3 with table prefix: '+tablePrefix+'. Error: ' + result3.error.message)
        throw result3.error
    }
    const result4 = await client.from(tablePrefix+'_regions_4').select('*').order('name')
    if (result4.error) {
        console.error('Unable to retrieve regions level 4 with table prefix: '+tablePrefix+'. Error: ' + result4.error.message)
        throw result4.error
    }

    const level1: Array<RegionNode> = result1.data.map((entry) => {
        return {id: entry.id, name: entry.name, level: 1, description: entry.description || ''}
    })
    const level2: Array<RegionNode> = result2.data.map((entry) => {
        return {id: entry.id, name: entry.name, level: 2, description: entry.description || '', parentId: entry.parent_id}
    })
    const level3: Array<RegionNode> = result3.data.map((entry) => {
        return {id: entry.id, name: entry.name, level: 3, description: entry.description || '', parentId: entry.parent_id}
    })
    const level4: Array<RegionNode> = result4.data.map((entry) => {
        return {id: entry.id, name: entry.name, level: 4, description: entry.description || '', parentId: entry.parent_id}
    })

    return {labels, level1, level2, level3, level4}
}

export async function getUserMember(client: SupabaseClient<Database>, userId: string, entityId: string): Promise<MemberDetails> {
    const {data, error} = await client.rpc('get_user_member', {user_id: userId, entity_id: entityId}).single()
    if (error) {
        console.error('Unable to retrieve member details for entity ID '+entityId+' and user ID '+userId+'. Error: '+error.message)
        throw error
    }
    // @ts-ignore
    const result = data as {user_id: string, username: string, avatar_filename: string, role_name: string}
    return createMemberDetails(client, result.user_id, result.username, result.avatar_filename, result.role_name)
}

export async function getUserMembers(client: SupabaseClient<Database>, entityId: string): Promise<Array<MemberDetails>> {
    const {data, error} = await client.rpc('get_user_members', {entity_id: entityId})
    if (error) {
        console.error('Unable to retrieve members for entity '+entityId+'. Error: '+error.message)
        throw error
    }
    return data ? data.map((dbMember) => {
        // @ts-ignore
        const result = dbMember as {user_id: string, username: string, avatar_filename: string, role_name: string}
        return createMemberDetails(client, result.user_id, result.username, result.avatar_filename, result.role_name)
    }) : new Array<MemberDetails>()
}

export async function getUserCandidates(client: SupabaseClient<Database>, entityId: string): Promise<Array<Profile>> {
    const {data, error} = await client.rpc('get_user_candidates', {entity_id: entityId})
    if (error) {
        console.error('Unable to retrieve non-members for entity '+entityId+'. Error: '+error.message)
        throw error
    }
    // @ts-ignore
    const result = data as Array<{user_id: string, user_name: string, avatar_filename: string, status: number}>
    return result ? result.map((dbProfile) => {
        return createProfile(client, dbProfile.user_id, dbProfile.user_name, dbProfile.avatar_filename, dbProfile.status)
    }) : new Array<Profile>()
}

export async function getProjectRoles(client: SupabaseClient): Promise<Array<Role>> {
    const {data, error} = await client.from('roles').select('*').match({from_type: EntityType.HUMAN, to_type: EntityType.PROJECT}).order('name')
    if (error) {
        console.error('Unable to retrieve project roles. Error: '+error.message)
        throw error
    }
    return data || new Array<Role>()
}

export async function getHubRoles(client: SupabaseClient): Promise<Array<Role>> {
    const {data, error} = await client.from('roles').select('*').match({from_type: EntityType.HUMAN, to_type: EntityType.HUB}).order('name')
    if (error) {
        console.error('Unable to retrieve hub roles. Error: '+error.message)
        throw error
    }
    return data || new Array<Role>()
}

export async function getLinksData(client: SupabaseClient<Database>, objectId: string): Promise<Array<LinkDetails>> {
    const {data, error} = await client.from('links').select('*').eq('owner_id', objectId)
    if (error) {
        console.error('Unable to retrieve links for owner ID '+objectId+'. Error: '+error.message)
        throw error
    }
    return data ? data.map((dbLink) => {
        const newItem: LinkDetails = {
            id: dbLink.id,
            url: dbLink.url,
            typeId: dbLink.type_id
        }
        return newItem
    }) : new Array<LinkDetails>()
}

export async function getHubData(client: SupabaseClient<Database>, hubId: string): Promise<Hub | null> {
    const {data, error} = await client.from('entities').select('*').eq('id', hubId).single()
    if (error) {
        console.error('Unable to retrieve data for hub ID '+hubId+'. Error: '+error.message)
        throw error
    }
    return data ? createEntity(data) : null
}

export async function getProjectData(client: SupabaseClient<Database>, projectId: string): Promise<Project | null> {
    const {data, error} = await client.from('entities').select('*').eq('id', projectId).single()
    if (error) {
        console.error('Unable to retrieve data for project ID '+projectId+'. Error: '+error.message)
        throw error
    }
    return data ? createEntity(data) : null
}

export async function getUserProfile(client: SupabaseClient<Database>, userId: string): Promise<Profile | null> {
    const {data, error} = await client.from('profiles').select('*').eq('id', userId).single() // uses policy
    if (error) {
        console.error('Unable to retrieve profile data for user ID '+userId+'. Error: '+error.message)
        throw error
    }
    return data ? createProfile(client, data.id, data.username || '', data.avatar_filename || '', data.status) : null
}

export async function updateAvatarFile(client: SupabaseClient<Database>, profileId: string, filename: string, file: any): Promise<{filename: string, url: string}> {
    const { error: uploadError } = await client.storage
        .from('avatars')
        .upload(filename, file, { upsert: true })
    if (uploadError) {
        console.log('Error uploading the file to storage: '+uploadError.message)
        throw uploadError
    }

    const updates = {avatar_filename: filename}
    const {error: updateError} = await client.from('profiles').update(updates).eq('id', profileId)
    if (updateError) {
        console.log('Error updating avatar filename for user ID ' + profileId+'. Error: '+updateError.message)
        throw updateError
    }

    const {data} = client.storage.from('avatars').getPublicUrl(filename)

    return {filename: filename, url: data?.publicUrl || ''}
}

export async function deleteLink(client: SupabaseClient<Database>, linkId: number) {
    const {error} = await client.from('links').delete().eq('id', linkId)
    if (error) {
        console.log('Error deleting link ID: '+linkId+'. Error: '+error.message)
        throw error
    }
}

export async function insertNewLink(client: SupabaseClient<Database>, url: string, typeId: number, ownerId: string): Promise<LinkDetails> {
    const newDbLink: DbLinkInsert = {url: url, type_id: typeId, owner_id: ownerId}
    const {data, error} = await client.from('links').insert(newDbLink).select('*').single()
    if (error) {
        console.log('Error insert a new link: '+JSON.stringify(newDbLink)+'. Error: '+error.message)
        throw error
    }
    return {id: data!.id, typeId: data!.type_id, url: url}
}

export async function getLinkTypes(client: SupabaseClient): Promise<Array<LinkType>> {
    const {data, error} = await client.from('link_types').select('*')
    if (error) {
        console.log('Error retrieving link types. Error: '+error.message)
        throw error
    }
    return data as Array<LinkType>
}

//
// Parameter choices: An undefined value = no change, don't update.
// a NULL value = update table, set to NULL = delete
export async function updateRegionAssociations(
    client: SupabaseClient<Database>,
    ownerId: string,
    oeRegion: RegionNode | null | undefined,
    epaRegion:RegionNode | null | undefined,
    customRegion: RegionNode | null | undefined
) {

    const updates: any = {owner_id: ownerId}
    if (oeRegion !== undefined) {
        updates['oe_region_id'] = oeRegion ? oeRegion.id : null
        updates['oe_level'] = oeRegion ? oeRegion.level : null
    }
    if (epaRegion !== undefined) {
        updates['epa_region_id'] = epaRegion ? epaRegion.id : null
        updates['epa_level'] = epaRegion ? epaRegion.level : null
    }
    if (customRegion !== undefined) {
        updates['rl_region_id'] = customRegion ? customRegion.id : null
        updates['rl_level'] = customRegion ? customRegion.level : null
    }

    const {data, error} = await client.from('region_associations').upsert(updates)
    if (error) {
        console.log('Error updating region associations for owner ID: ' + ownerId + ', updates: '+JSON.stringify(updates)+'. Error: ' + error.message)
        throw error
    }
    return getRegionAssociations(client, ownerId)
}

export async function addRelationship(client: SupabaseClient<Database>, fromId: string, toId: string, roleId: string) {
    const updates: DbRelationship = {from_id: fromId, to_id: toId, role_id: roleId}
    const {data, error} = await client.from('relationships').insert(updates)
    if (error) {
        console.error('Unable to add relation from ID '+fromId+' to ID '+toId+' with role '+roleId+'. Error: '+error.message)
        throw error
    }
}

export async function removeRelationship(client: SupabaseClient<Database>, fromId: string, toId: string) {
    const {data, error} = await client.from('relationships').delete().match({from_id: fromId, to_id: toId})
    if (error) {
        console.error('Unable to remove relationship from ID '+fromId+' to ID '+toId+'. Error: '+error.message)
        throw error
    }
}

export async function getEntitiesByType(client: SupabaseClient<Database>, type: EntityType): Promise<Array<LocationEntity>> {
    const {data, error} = await client.from('entities').select('*').eq('type_id', type).order('name')
    if (error) {
        console.error('Unable to retrieve entities of type '+type+'. Error: '+error.message)
        throw error
    }
    if (data) {
        return data.map((item: DbEntity) => {
            const e: LocationEntity = {
                id: item.id,
                name: item.name,
                description: item.description || '',
                type: item.type_id,
                position: item.position || [],
                polygon: item.polygon ? item.polygon.toString() : null,
            }
            return e
        })
    }
    return new Array<LocationEntity>()
}

export async function getHubs(client: SupabaseClient<Database>): Promise<Array<Hub>> {
    return getEntitiesByType(client, EntityType.HUB)
}

export async function getProjects(client: SupabaseClient<Database>): Promise<Array<Project>> {
    return getEntitiesByType(client, EntityType.PROJECT)
}

export async function getRolesDictionary(client: SupabaseClient<Database>): Promise<RolesDictionary> {
    const {data, error} = await client.from('roles').select('*')
    if (error) {
        console.error('Unable to retrieve roles. Error: '+error.message)
        throw error
    }
    const result: RolesDictionary = new Map<RoleKey, Array<Role>>()
    if (data) {
        data.forEach((dbRole: DbRole) => {
            const roleKey: RoleKey = {fromType: dbRole.from_type, toType: dbRole.to_type}
            const role: Role = {id: dbRole.id, name: dbRole.name, description: dbRole.description || ''}
            if (result.has(roleKey))
                result.set(roleKey, [...result.get(roleKey)!, role])
            else
                result.set(roleKey, [role])
        })
    }
    return result
}

export async function updateEntity(client: SupabaseClient<Database>, entity: Entity | LocationEntity) {
    let updates = {
        name: entity.name,
        description: entity.description
    }
    if (isLocationEntity(entity)) {
        updates = {...updates, ...{
            position: entity.position,
            polygon: entity.polygon
        }}
    }
    const {error} = await client.from('entities').update(updates).eq('id', entity.id)
    if (error) {
        console.log('Error updating entity ID '+entity.id)
        throw error
    }
}