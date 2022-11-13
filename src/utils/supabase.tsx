import {GetServerSidePropsContext} from "next";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {SupabaseClient} from "@supabase/supabase-js";
import {Session} from "@supabase/auth-helpers-react";

import { Database } from "./database.types";

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Hub = Database['public']['Tables']['hubs']['Row']

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