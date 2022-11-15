import {GetServerSidePropsContext} from "next";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {SupabaseClient} from "@supabase/supabase-js";
import {Session, useSession, useSupabaseClient} from "@supabase/auth-helpers-react";

import { Database } from "./database.types";

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Hub = Database['public']['Tables']['hubs']['Row']
export type Link = Database['public']['Tables']['links']['Row']

export type DbContenxt = {
    client: SupabaseClient
    session: Session | null
}

export const getServerClient = async (ctx: GetServerSidePropsContext): Promise<DbContenxt> => {
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
        const {data, error} = await client.from('profiles').select('avatar_url')
        if (error)
            throw error
        return data[0].avatar_url
    }
    return null
}

