import { atom } from 'jotai'

import {Hub, Profile, Project} from "../utils/types";
import {getProjectCandidatesForHub, getUserCandidates} from "../utils/supabase";
import {dbClientAtom} from "./global";

export const editAtom = atom<boolean>(false)

export const isHubAdminAtom = atom<boolean>(false)

export const currentHubAtom = atom<Hub | null>(null)

export const hubMemberCandidatesAtom = atom<Promise<Array<Profile>>>( async (get) => {
    const hub = get(currentHubAtom)
    return hub ? getUserCandidates(get(dbClientAtom), hub.id) : new Array<Profile>()
})

export const hubProjectCandidatesAtom = atom<Promise<Array<Project>>>(async (get) => {
    const hub = get(currentHubAtom)
    return hub ? getProjectCandidatesForHub(get(dbClientAtom), hub.id) : new Array<Project>()
})

export const hubProjectsAtom = atom<Array<Project>>(new Array<Project>())