import {GetServerSidePropsContext} from "next";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {SupabaseClient} from "@supabase/supabase-js";
import {Session, useSupabaseClient, useUser} from "@supabase/auth-helpers-react";

import {Database} from "./database.types";
import {
    BioregionInfo,
    LinkDetails,
    MemberDetails,
    MembershipItem,
    Hub,
    Subrealm,
    Bioregion,
    Realm,
    Profile,
    Project
} from "./types";

type DbProfile = Database['public']['Tables']['profiles']['Row']
type DbHub = Database['public']['Tables']['hubs']['Row']
type DbLink = Database['public']['Tables']['links']['Row']
type DbProject = Database['public']['Tables']['projects']['Row']
type DbProjectRole = Database['public']['Tables']['project_roles']['Row']
type DbHubRole = Database['public']['Tables']['hub_roles']['Row']
type DbProjectMember = Database['public']['Tables']['project_members']['Row']
type DbHubMember = Database['public']['Tables']['hub_members']['Row']
type DbBioregion = Database['public']['Tables']['bioregions']['Row']
type DbRealm = Database['public']['Tables']['realms']['Row']

export type DbContext = {
    client: SupabaseClient
    session: Session | null
}

export const getServerClient = async (ctx: GetServerSidePropsContext): Promise<DbContext> => {
    const supabase = createServerSupabaseClient<Database>(ctx)
    const {
        data: {session},
    } = await supabase.auth.getSession()

    return { client: supabase, session }
}

export async function downloadAvatarImage(client: SupabaseClient, filename: string, setUrl: Function) {
    try {
        const { data, error } = await client.storage.from('avatars').download(filename)
        if (error)
            throw error

        const url = URL.createObjectURL(data)
        setUrl(url)
    } catch (error) {
        console.log('Error downloading image: ', error)
    }
}

export async function getAvatarFilename(session: Session, client: SupabaseClient): Promise<String> {
    if (session) { // make sure we have a logged-in user for RLS
        const {data, error} = await client.from('profiles').select('avatar_url').single()
        if (error)
            throw error
        return data ? data.avatar_url : ''
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

export async function getProjectsForUser(supabase: SupabaseClient, userId: string): Promise<Array<MembershipItem | undefined>> {
    const {data, error} = await supabase.rpc('get_user_projects', {user_id: userId})
    if (error) {
        console.error('Unable to retrieve projects for profile ' + userId + '. Error: ' + error.message)
        throw error
    }
    return data as Array<MembershipItem>
}

export async function getHubsForUser(supabase: SupabaseClient, userId: string): Promise<Array<MembershipItem>> {
    const {data, error} = await supabase.rpc('get_user_hubs', {user_id: userId})
    if (error) {
        console.error('Unable to retrieve hubs for profile ' + userId + '. Error: ' + error.message)
        throw error
    }
    return data as Array<MembershipItem>
}

export async function getBioregionData(supabase: SupabaseClient, bioregionId: number): Promise<BioregionInfo | null> {
    const {data, error} = await supabase.rpc('get_bioregion_data', {bioregion_id: bioregionId}).single()
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
        const info: BioregionInfo = {
            bioregion: bioregion,
            subrealm: subrealm,
            realm: realm,
        }
        return info
    }
    return null
}

export async function getHubMembersData(supabase: SupabaseClient, hubId: string): Promise<Array<MemberDetails>> {
    const {data, error} = await supabase.rpc('get_hub_members', {hub_id: hubId})
    if (error) {
        console.error('Unable to retrieve members for hub '+hubId+'. Error: '+error.message)
        throw error
    }
    return data ? data.map((dbMember) => {
        const newItem: MemberDetails = {
            userId: dbMember.user_id,
            username: dbMember.username,
            avatarImage: dbMember.avatar_image,
            roleName: dbMember.role_name,
            avatarURL: ''
        }
        if (newItem.avatarImage) {
            const urlResult = supabase.storage.from('avatars').getPublicUrl(newItem.avatarImage)
            newItem.avatarURL = urlResult.data.publicUrl
        }
        return newItem
    }) : new Array<MemberDetails>()
}

export async function getLinksData(supabase: SupabaseClient, objectId: string): Promise<Array<LinkDetails>> {
    const {data, error} = await supabase.from('links').select('*, link_types(name)').eq('owner_id', objectId)
    if (error) {
        console.error('Unable to retrieve links for object ID '+objectId+'. Error: '+error.message)
        throw error
    }
    return data ? data.map((dbLink) => {
        const newItem: LinkDetails = {
            url: dbLink.url,
            type: dbLink.link_types.name
        }
        return newItem
    }) : new Array<LinkDetails>()
}

export async function getHubData(supabase: SupabaseClient, hubId: string): Promise<Hub | null> {
    const {data, error} = await supabase.from('hubs').select('*').eq('id', hubId).single()
    if (error) {
        console.error('Unable to retrieve data for hub ID '+hubId+'. Error: '+error.message)
        throw error
    }
    if (data) {
        const newItem: Hub = {
            id: data.id,
            name: data.name,
            description: data.description,
            bioregionId: data.bioregion_id
        }
        return newItem
    }
    return null
}

export async function getUserProfile(supabase: SupabaseClient, userId: string): Promise<Profile | null> {
    const {data, error} = await supabase.from('profiles').select('*').eq('id', userId).single() // uses policy
    if (error) {
        console.error('Unable to retrieve profile data for user ID '+userId+'. Error: '+error.message)
        throw error
    }
    if (data) {
        const newItem: Profile = {
            id: data.id,
            avatarURL: '',
            username: data.username
        }
        if (data.avatar_url) {
            const urlResult = supabase.storage.from('avatars').getPublicUrl(data.avatar_url)
            newItem.avatarURL = urlResult.data.publicUrl
        }
        return newItem
    }
    return null
}

export async function getHubs(supabase: SupabaseClient): Promise<Array<Hub>> {
    const {data, error} = await supabase.from('hubs').select('*')
    if (error) {
        console.error('Unable to retrieve hubs. Error: '+error.message)
        throw error
    }
    if (data) {
        return data.map((item:DbHub) => {
            const hub: Hub = {
                id: item.id,
                name: item.name,
                description: item.description || '',
                bioregionId: item.bioregion_id
            }
            return hub
        })
    }
    return new Array<Hub>()
}

export async function getProjects(supabase: SupabaseClient): Promise<Array<Project>> {
    const {data, error} = await supabase.from('projects').select('*')
    if (error) {
        console.error('Unable to retrieve projects. Error: '+error.message)
        throw error
    }
    if (data) {
        return data.map((item:DbProject) => {
            const project: Project = {
                id: item.id,
                name: item.name,
                description: item.description || '',
                bioregionId: item.bioregion_id
            }
            return project
        })
    }
    return new Array<Project>()
}