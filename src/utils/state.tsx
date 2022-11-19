import { atom } from 'jotai'
import {Profile} from "./types";
import {SupabaseClient} from "@supabase/supabase-js";

export const supabaseClient = atom<SupabaseClient>(null)
export const currentUserProfile = atom<Profile>(null)
export const isHubAdminAtom = atom<boolean>(false)
