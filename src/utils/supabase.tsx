import {GetServerSidePropsContext} from "next";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {SupabaseClient} from "@supabase/supabase-js";
import {Session, useSupabaseClient, useUser} from "@supabase/auth-helpers-react";

import { Database } from "./database.types";
import {useAtom} from "jotai";
import {fdatasync} from "fs";

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Hub = Database['public']['Tables']['hubs']['Row']
export type Link = Database['public']['Tables']['links']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectRole = Database['public']['Tables']['project_roles']['Row']
export type HubRole = Database['public']['Tables']['hub_roles']['Row']
export type ProjectMember = Database['public']['Tables']['project_members']['Row']
export type HubMember = Database['public']['Tables']['hub_members']['Row']

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
        if (error) {
            throw error
        }
        const url = URL.createObjectURL(data)
        setUrl(url)
    } catch (error) {
        console.log('Error downloading image: ', error)
    }
}

export async function getAvatarFilename(session: Session, client: SupabaseClient) {
    if (session) { // make sure we have a logged-in user for RLS
        const {data, error} = await client.from('profiles').select('avatar_url').single()
        if (error)
            throw error
        return data ? data.avatar_url : ''
    }
    return null
}

export async function isUserHubAdmin(client: SupabaseClient, userId: string, hubId: string) {
    const {data, error} = await client.from('hub_members').select('hub_roles(name)').eq('hub_id', hubId).single()
    if (error) {
        console.error('Unable to retrieve member relationship for hub ID ' + hubId + ' and user ' + userId + '. Error: ' + error)
        return false
    }
    const result = data as {hub_roles: {name: string}}
    return result.hub_roles.name.toUpperCase() == 'ADMIN'
}

export async function isUserProjectAdmin(client: SupabaseClient, userId: string, projectId: string) {
    const {data, error} = await client.from('project_members').select('project_roles(name)').eq('project_id', projectId).single()
    if (error) {
        console.error('Unable to retrieve member relationship for project ID ' + projectId + ' and user ' + userId + '. Error: ' + error)
        return false
    }
    const result = data as {project_roles: {name: string}}
    return result.project_roles.name.toUpperCase() == 'ADMIN'
}

// Custom types and functions
export type MembershipItem = {id: string, name: string, description: string, role: string}

export async function getProjectsForUser(supabase: SupabaseClient, userId: string): Promise<Array<MembershipItem | undefined>> {
    const {data, error} = await supabase.rpc('get_user_projects', {user_id: userId})
    if (error)
        console.error('Unable to retrieve projects for profile '+userId+'. Error: '+error);
    return data as Array<MembershipItem>
}

export async function getHubsForUser(supabase: SupabaseClient, userId: string): Promise<Array<MembershipItem>> {
    const {data, error} = await supabase.rpc('get_user_hubs', {user_id: userId})
    if (error)
        console.error('Unable to retrieve hubs for profile '+userId+'. Error: '+error);
    return data as Array<MembershipItem>
}
