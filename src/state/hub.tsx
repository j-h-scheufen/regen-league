import { atom } from 'jotai'

import {Hub, Profile} from "../utils/types";
import {getNonHubMembers} from "../utils/supabase";
import {dbClientAtom} from "./global";

export const editAtom = atom<boolean>(false)
export const isHubAdminAtom = atom<boolean>(false)
export const currentHubAtom = atom<Hub | null>(null)
export const hubMemberCandidates = atom<Promise<Array<Profile>>>( async (get) => {
    const hub = get(currentHubAtom)
    return hub ? getNonHubMembers(get(dbClientAtom), hub.id) : new Array<Profile>()
})
