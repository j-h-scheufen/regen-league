import {GetServerSidePropsContext} from "next";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {SupabaseClient} from "@supabase/supabase-js";
import {Session} from "@supabase/auth-helpers-react";

import {Database} from "./database.types";
import {
    RegionInfo,
    RegionCatalog,
    LinkDetails,
    MemberDetails,
    MembershipItem,
    Hub,
    Profile,
    Project,
    LinkType,
    RegionNode,
    RegionAssociations, Role, UserStatus
} from "./types";

type DbHub = Database['public']['Tables']['hubs']['Row']
type DbLinkInsert = Database['public']['Tables']['links']['Insert']
type DbProject = Database['public']['Tables']['projects']['Row']
type DbHubMember = Database['public']['Tables']['hub_members']['Row']
type DbProjectMember = Database['public']['Tables']['project_members']['Row']
type DbHubProject = Database['public']['Tables']['projects_to_hubs']['Row']

export type DbContext = {
    client: SupabaseClient
    session: Session | null
}

// Helper Functions
function createMemberDetails(client: SupabaseClient, userId: string, username: string, avatarFilename: string, role: string): MemberDetails {
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

function createProfile(client: SupabaseClient, id: string, username: string, avatarFilename: string, status: UserStatus): Profile {
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

export const getServerClient = async (ctx: GetServerSidePropsContext): Promise<DbContext> => {
    const client = createServerSupabaseClient<Database>(ctx)
    const {
        data: {session},
    } = await client.auth.getSession()

    return { client, session }
}

export async function getAvatarFilename(session: Session, client: SupabaseClient): Promise<String> {
    if (session) { // make sure we have a logged-in user for RLS
        const {data, error} = await client.from('profiles').select('avatar_filename').single()
        if (error)
            throw error
        return data ? data.avatar_filename : ''
    }
    return ''
}

export async function isUserHubAdmin(client: SupabaseClient, userId: string, hubId: string) {
    const {data, error} = await client.from('hub_members').select('hub_roles(name)').eq('hub_id', hubId).eq('user_id', userId).single()
    if (error) {
        console.error('Unable to retrieve member relationship for hub ID ' + hubId + ' and user ' + userId + '. Error: ' + error.message)
        return false
    }
    const result = data as {hub_roles: {name: string}}
    return result.hub_roles.name.toUpperCase() == 'ADMIN'
}

export async function isUserProjectAdmin(client: SupabaseClient, userId: string, projectId: string) {
    const {data, error} = await client.from('project_members').select('project_roles(name)').eq('project_id', projectId).eq('user_id', userId).single()
    if (error) {
        console.error('Unable to retrieve member relationship for project ID ' + projectId + ' and user ' + userId + '. Error: ' + error.message)
        return false
    }
    const result = data as {project_roles: {name: string}}
    return result.project_roles.name.toUpperCase() == 'ADMIN'
}

export async function getProjectsForUser(client: SupabaseClient, userId: string): Promise<Array<MembershipItem>> {
    const {data, error} = await client.rpc('get_user_projects', {user_id: userId})
    if (error) {
        console.error('Unable to retrieve projects for profile ' + userId + '. Error: ' + error.message)
        throw error
    }
    return data as Array<MembershipItem>
}

export async function getHubsForUser(client: SupabaseClient, userId: string): Promise<Array<MembershipItem>> {
    const {data, error} = await client.rpc('get_user_hubs', {user_id: userId})
    if (error) {
        console.error('Unable to retrieve hubs for profile ' + userId + '. Error: ' + error.message)
        throw error
    }
    return data as Array<MembershipItem>
}

export async function getProjectsForHub(client: SupabaseClient, hubId: string): Promise<Array<Project>> {
    const {data, error} = await client.rpc('get_hub_projects', {hub_id: hubId})
    if (error) {
        console.error('Unable to retrieve projects for hub ID ' + hubId + '. Error: ' + error.message)
        throw error
    }
    return data || new Array<Project>()
}

export async function getNonProjectsForHub(client: SupabaseClient, hubId: string): Promise<Array<Project>> {
    const {data, error} = await client.rpc('get_non_hub_projects', {hub_id: hubId})
    if (error) {
        console.error('Unable to retrieve project candidates for hub ID ' + hubId + '. Error: ' + error.message)
        throw error
    }
    return data || new Array<Project>()
}

async function getRegionInfo(client: SupabaseClient, regionId: number | string, level: number, tablePrefix: string): Promise<RegionInfo> {
    const tablename = 'get_'+tablePrefix+'_region_info_l'+level
    const {data, error} = await client.rpc(tablename, {region_id: regionId}).single()
    if (error) {
        console.error('Unable to retrieve region info from table '+tablename+', region ID: ' + regionId + ', level: '+level+'. Error: ' + error.message)
        throw error
    }

    const result = Array<RegionNode>()
    if (data) {
        for (let i=1; i <= level; i++) {
            result[i-1] = {id: data['l'+i+'_id'], level: i, link: data['l'+i+'_link'], name: data['l'+i+'_name']}
        }
    }
    return result
}

export async function getRegionAssociations(client: SupabaseClient, ownerId: string): Promise<RegionAssociations> {
    const {data, error} = await client.from('region_associations').select('*').eq('owner_id', ownerId)
    if (error) {
        console.error('Unable to retrieve region associations from owner ID ' + ownerId + '. Error: ' + error.message)
        throw error
    }

    const associations: RegionAssociations = {
        oneEarth: data[0]?.oe_region_id ? await getRegionInfo(client, data[0].oe_region_id, data[0].oe_level, 'oe') : null,
        epa: data[0]?.epa_region_id ? await getRegionInfo(client, data[0].epa_region_id, data[0].epa_level, 'epa') : null,
        custom: data[0]?.rl_region_id ? await getRegionInfo(client, data[0].rl_region_id, data[0].rl_level, 'rl') : null
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

async function getStandardCatalog(client: SupabaseClient, tablePrefix: string, labels: Array<string>): Promise<RegionCatalog> {
    const result1 = await client.from(tablePrefix+'_regions_1').select('*')
    if (result1.error) {
        console.error('Unable to retrieve regions level 1 with table prefix: '+tablePrefix+'. Error: ' + result1.error.message)
        throw result1.error
    }
    const result2 = await client.from(tablePrefix+'_regions_2').select('*')
    if (result2.error) {
        console.error('Unable to retrieve regions level 2 with table prefix: '+tablePrefix+'. Error: ' + result2.error.message)
        throw result2.error
    }
    const result3 = await client.from(tablePrefix+'_regions_3').select('*')
    if (result3.error) {
        console.error('Unable to retrieve regions level 3 with table prefix: '+tablePrefix+'. Error: ' + result3.error.message)
        throw result3.error
    }
    const result4 = await client.from(tablePrefix+'_regions_4').select('*')
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

export async function getHubMembers(client: SupabaseClient, hubId: string): Promise<Array<MemberDetails>> {
    const {data, error} = await client.rpc('get_hub_members', {hub_id: hubId})
    if (error) {
        console.error('Unable to retrieve members for hub '+hubId+'. Error: '+error.message)
        throw error
    }
    return data ? data.map((dbMember) => {
        return createMemberDetails(client, dbMember.user_id, dbMember.username, dbMember.avatar_filename, dbMember.role_name)
    }) : new Array<MemberDetails>()
}

export async function getProjectMembers(client: SupabaseClient, projectId: string): Promise<Array<MemberDetails>> {
    const {data, error} = await client.rpc('get_project_members', {project_id: projectId})
    if (error) {
        console.error('Unable to retrieve members for project '+projectId+'. Error: '+error.message)
        throw error
    }
    return data ? data.map((dbMember) => {
        return createMemberDetails(client, dbMember.user_id, dbMember.username, dbMember.avatar_filename, dbMember.role_name)
    }) : new Array<MemberDetails>()
}

export async function getNonHubMembers(client: SupabaseClient, hubId: string): Promise<Array<Profile>> {
    const {data, error} = await client.rpc('get_non_hub_members', {hub_id: hubId})
    if (error) {
        console.error('Unable to retrieve non-members for hub '+hubId+'. Error: '+error.message)
        throw error
    }
    return data ? data.map((dbProfile) => {
        return createProfile(client, dbProfile.user_id, dbProfile.username, dbProfile.avatar_filename, dbProfile.status)
    }) : new Array<Profile>()
}

export async function getNonProjectMembers(client: SupabaseClient, projectId: string): Promise<Array<Profile>> {
    const {data, error} = await client.rpc('get_non_project_members', {project_id: projectId})
    if (error) {
        console.error('Unable to retrieve non-members for project '+projectId+'. Error: '+error.message)
        throw error
    }
    return data ? data.map((dbProfile) => {
        return createProfile(client, dbProfile.user_id, dbProfile.username, dbProfile.avatar_filename, dbProfile.status)
    }) : new Array<Profile>()
}

export async function addHubMembership(client: SupabaseClient, hubId: string, userId: string, roleId: number): Promise<MemberDetails> {
    const updates: DbHubMember = {hub_id: hubId, role_id: roleId, user_id: userId}
    const {data, error} = await client.from('hub_members').upsert(updates).select('*')
    if (error) {
        console.error('Unable to add membership for hub ID '+hubId+' and user ID '+userId+'. Error: '+error.message)
        throw error
    }
    const memberResult = await client.rpc('get_hub_member', {hub_id: hubId, user_id: userId}).single()
    if (memberResult.error) {
        console.error('Unable to retrieve member details for hub ID '+hubId+' and user ID '+userId+'. Error: '+memberResult.error.message)
        throw error
    }
    const result = memberResult.data
    return createMemberDetails(client, result.user_id, result.username, result.avatar_filename, result.role_name)
}

export async function addProjectMembership(client: SupabaseClient, projectId: string, userId: string, roleId: number): Promise<MemberDetails> {
    const updates: DbProjectMember = {project_id: projectId, role_id: roleId, user_id: userId}
    const {data, error} = await client.from('project_members').upsert(updates).select('*')
    if (error) {
        console.error('Unable to add membership for project ID '+projectId+' and user ID '+userId+'. Error: '+error.message)
        throw error
    }
    const memberResult = await client.rpc('get_project_member', {project_id: projectId, user_id: userId}).single()
    if (memberResult.error) {
        console.error('Unable to retrieve member details for project ID '+projectId+' and user ID '+userId+'. Error: '+memberResult.error.message)
        throw error
    }
    const result = memberResult.data
    return createMemberDetails(client, result.user_id, result.username, result.avatar_filename, result.role_name)
}

export async function removeHubMembership(client: SupabaseClient, hubId: string, userId: string) {
    const {error} = await client.from('hub_members').delete().match({hub_id: hubId, user_id: userId})
    if (error) {
        console.error('Unable to remove membership for hub ID '+hubId+' and user ID '+userId+'. Error: '+error.message)
        throw error
    }
}

export async function removeProjectMembership(client: SupabaseClient, projectId: string, userId: string) {
    const {error} = await client.from('project_members').delete().match({project_id: projectId, user_id: userId})
    if (error) {
        console.error('Unable to remove membership for hub ID '+projectId+' and user ID '+userId+'. Error: '+error.message)
        throw error
    }
}

export async function getProjectRoles(client: SupabaseClient): Promise<Array<Role>> {
    const {data, error} = await client.from('project_roles').select('*').order('name')
    if (error) {
        console.error('Unable to retrieve project roles. Error: '+error.message)
        throw error
    }
    return data || new Array<Role>()
}

export async function getHubRoles(client: SupabaseClient): Promise<Array<Role>> {
    const {data, error} = await client.from('hub_roles').select('*').order('name')
    if (error) {
        console.error('Unable to retrieve hub roles. Error: '+error.message)
        throw error
    }
    return data || new Array<Role>()
}

export async function getLinksData(client: SupabaseClient, objectId: string): Promise<Array<LinkDetails>> {
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

export async function getHubData(client: SupabaseClient, hubId: string): Promise<Hub | null> {
    const {data, error} = await client.from('hubs').select('*').eq('id', hubId).single()
    if (error) {
        console.error('Unable to retrieve data for hub ID '+hubId+'. Error: '+error.message)
        throw error
    }
    if (data) {
        const newItem: Hub = {
            id: data.id,
            name: data.name,
            description: data.description
        }
        return newItem
    }
    return null
}

export async function getProjectData(client: SupabaseClient, projectId: string): Promise<Project | null> {
    const {data, error} = await client.from('projects').select('*').eq('id', projectId).single()
    if (error) {
        console.error('Unable to retrieve data for project ID '+projectId+'. Error: '+error.message)
        throw error
    }
    if (data) {
        const newItem: Project = {
            id: data.id,
            name: data.name,
            description: data.description
        }
        return newItem
    }
    return null
}

export async function getUserProfile(client: SupabaseClient, userId: string): Promise<Profile | null> {
    const {data, error} = await client.from('profiles').select('*').eq('id', userId).single() // uses policy
    if (error) {
        console.error('Unable to retrieve profile data for user ID '+userId+'. Error: '+error.message)
        throw error
    }
    if (data) {
        return createProfile(client, data.id, data.username, data.avatar_filename, data.status)
    }
    return null
}

export async function getHubs(client: SupabaseClient): Promise<Array<Hub>> {
    const {data, error} = await client.from('hubs').select('*').order('name')
    if (error) {
        console.error('Unable to retrieve hubs. Error: '+error.message)
        throw error
    }
    if (data) {
        return data.map((item:DbHub) => {
            const hub: Hub = {
                id: item.id,
                name: item.name,
                description: item.description || ''
            }
            return hub
        })
    }
    return new Array<Hub>()
}

export async function getProjects(client: SupabaseClient): Promise<Array<Project>> {
    const {data, error} = await client.from('projects').select('*').order('name')
    if (error) {
        console.error('Unable to retrieve projects. Error: '+error.message)
        throw error
    }
    if (data) {
        return data.map((item:DbProject) => {
            const project: Project = {
                id: item.id,
                name: item.name,
                description: item.description || ''
            }
            return project
        })
    }
    return new Array<Project>()
}

export async function updateAvatarFile(client: SupabaseClient, profileId: string, filename: string, file: any): Promise<{filename: string, url: string}> {
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

export async function deleteLink(client: SupabaseClient, linkId: number) {
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
    const newLink: LinkDetails = {id: data.id, typeId: data.type_id, url: url}
    return newLink
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
    client: SupabaseClient,
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

export async function addProjectToHub(client: SupabaseClient, hubId: string, projectId: string) {
    const updates: DbHubProject = {hub_id: hubId, project_id: projectId}
    const {data, error} = await client.from('projects_to_hubs').insert(updates)
    if (error) {
        console.error('Unable to add project ID '+projectId+' to hub ID '+hubId+'. Error: '+error.message)
        throw error
    }
}


export async function removeProjectFromHub(client: SupabaseClient, hubId: string, projectId: string) {
    const {data, error} = await client.from('projects_to_hubs').delete().match({hub_id: hubId, project_id: projectId})
    if (error) {
        console.error('Unable to remove project ID '+projectId+' from hub ID '+hubId+'. Error: '+error.message)
        throw error
    }
}
