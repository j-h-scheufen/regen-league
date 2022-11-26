import {GetServerSidePropsContext} from "next";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {SupabaseClient} from "@supabase/supabase-js";
import {Session} from "@supabase/auth-helpers-react";

import {Database} from "./database.types";
import {
    OneEarthInfo,
    LinkDetails,
    MemberDetails,
    MembershipItem,
    Hub,
    Subrealm,
    Bioregion,
    Realm,
    Profile,
    Project, LinkType, OneEarthCatalog, RegionNode, RegionAssociations
} from "./types";

type DbHub = Database['public']['Tables']['hubs']['Row']
type DbLinkInsert = Database['public']['Tables']['links']['Insert']
type DbProject = Database['public']['Tables']['projects']['Row']
type DbEcoregion = Database['public']['Tables']['oe_ecoregions']['Row']
type DbBioregion = Database['public']['Tables']['oe_bioregions']['Row']
type DbSubrealm = Database['public']['Tables']['oe_subrealms']['Row']
type DbRealm = Database['public']['Tables']['oe_realms']['Row']

export type DbContext = {
    client: SupabaseClient
    session: Session | null
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

export async function getOneEarthInfo(client: SupabaseClient, bioregionId: number): Promise<OneEarthInfo | null> {
    const {data, error} = await client.rpc('get_bioregion_data', {bioregion_id: bioregionId}).single()
    if (error) {
        console.error('Unable to retrieve bioregion data ID ' + bioregionId + '. Error: ' + error.message)
        throw error
    }
    if (data) {
        const bioregion: Bioregion = {
            id: data.br_id,
            code: data.br_code,
            name: data.br_name,
            link: data.br_link,
        }
        const subrealm: Subrealm = {
            id: data.sr_id,
            name: data.sr_name,
        }
        const realm: Realm = {
            id: data.r_id,
            name: data.r_name,
            link: data.r_link
        }
        const info: OneEarthInfo = {
            bioregion: bioregion,
            subrealm: subrealm,
            realm: realm,
        }
        return info
    }
    return null
}

export async function getRegionAssociations(client: SupabaseClient, ownerId: string): Promise<RegionAssociations> {
    const {data, error} = await client.from('region_associations').select('*').eq('owner_id', ownerId)
    if (error) {
        console.error('Unable to retrieve region associations from owner ID ' + ownerId + '. Error: ' + error.message)
        throw error
    }

    const associations: RegionAssociations = {
        oneEarth: data[0]?.oe_bioregion_id ? await getOneEarthInfo(client, data[0].oe_bioregion_id) : null,
        epa: null,
        custom: new Array<RegionNode>()
    }
    return associations
}

export async function getOneEarthCatalog(client: SupabaseClient): Promise<OneEarthCatalog> {
    const rResult = await client.from('oe_realms').select('*')
    if (rResult.error) {
        console.error('Unable to retrieve OE realms. Error: ' + rResult.error.message)
        throw rResult.error
    }
    const srResult = await client.from('oe_subrealms').select('*')
    if (srResult.error) {
        console.error('Unable to retrieve OE subrealms. Error: ' + srResult.error.message)
        throw srResult.error
    }
    const brResult = await client.from('oe_bioregions').select('*')
    if (brResult.error) {
        console.error('Unable to retrieve OE bioregions. Error: ' + brResult.error.message)
        throw brResult.error
    }
    const erResult = await client.from('oe_ecoregions').select('*')
    if (erResult.error) {
        console.error('Unable to retrieve OE ecoregions. Error: ' + erResult.error.message)
        throw erResult.error
    }

    const realms: Array<RegionNode> = rResult.data.map((entry: DbRealm) => {
        return {id: entry.id, name: entry.name}
    })
    const subrealms: Array<RegionNode> = srResult.data.map((entry: DbSubrealm) => {
        return {id: entry.id, name: entry.name, parent: entry.realm_id}
    })
    const bioregions: Array<RegionNode> = brResult.data.map((entry: DbBioregion) => {
        return {id: entry.id, name: entry.name, parent: entry.subrealm_id}
    })
    const ecoregions: Array<RegionNode> = brResult.data.map((entry: DbEcoregion) => {
        return {id: entry.id, name: entry.name, parent: entry.bioregion_id}
    })
    return {bioregions: bioregions, ecoregions: ecoregions, realms: realms, subrealms: subrealms}
}

export async function getHubMembersData(client: SupabaseClient, hubId: string): Promise<Array<MemberDetails>> {
    const {data, error} = await client.rpc('get_hub_members', {hub_id: hubId})
    if (error) {
        console.error('Unable to retrieve members for hub '+hubId+'. Error: '+error.message)
        throw error
    }
    return data ? data.map((dbMember) => {
        const newItem: MemberDetails = {
            userId: dbMember.user_id,
            username: dbMember.username,
            avatarImage: dbMember.avatar_filename,
            roleName: dbMember.role_name,
            avatarURL: ''
        }
        if (newItem.avatarImage) {
            const urlResult = client.storage.from('avatars').getPublicUrl(newItem.avatarImage)
            newItem.avatarURL = urlResult.data.publicUrl
        }
        return newItem
    }) : new Array<MemberDetails>()
}

export async function getProjectMembersData(client: SupabaseClient, projectId: string): Promise<Array<MemberDetails>> {
    const {data, error} = await client.rpc('get_project_members', {project_id: projectId})
    if (error) {
        console.error('Unable to retrieve members for project '+projectId+'. Error: '+error.message)
        throw error
    }
    return data ? data.map((dbMember) => {
        const newItem: MemberDetails = {
            userId: dbMember.user_id,
            username: dbMember.username,
            avatarImage: dbMember.avatar_filename,
            roleName: dbMember.role_name,
            avatarURL: ''
        }
        if (newItem.avatarImage) {
            const urlResult = client.storage.from('avatars').getPublicUrl(newItem.avatarImage)
            newItem.avatarURL = urlResult.data.publicUrl
        }
        return newItem
    }) : new Array<MemberDetails>()
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
        const newItem: Profile = {
            id: data.id,
            avatarFilename: data.avatar_filename,
            avatarURL: '',
            username: data.username
        }
        if (data.avatar_filename) {
            const urlResult = client.storage.from('avatars').getPublicUrl(data.avatar_filename)
            newItem.avatarURL = urlResult.data.publicUrl
        }
        return newItem
    }
    return null
}

export async function getHubs(client: SupabaseClient): Promise<Array<Hub>> {
    const {data, error} = await client.from('hubs').select('*')
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
    const {data, error} = await client.from('projects').select('*')
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