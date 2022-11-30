import { atom } from 'jotai'

import {Project, Profile} from "../utils/types";
import {getNonProjectMembers} from "../utils/supabase";
import {dbClientAtom} from "./global";

export const editAtom = atom<boolean>(false)
export const isProjectAdminAtom = atom<boolean>(false)
export const currentProjectAtom = atom<Project | null>(null)
export const projectMemberCandidates = atom<Promise<Array<Profile>>>( async (get) => {
    const project = get(currentProjectAtom)
    return project ? getNonProjectMembers(get(dbClientAtom), project.id) : new Array<Profile>()
})
