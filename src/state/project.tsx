import { atom } from "jotai";

import { Project, Profile } from "../utils/types";
import { getUserCandidates } from "../utils/supabase";
import { dbClientAtom } from "./global";

export const editAtom = atom<boolean>(false);

export const isProjectAdminAtom = atom<boolean>(false);

export const currentProjectAtom = atom<Project | null>(null);

export const projectMemberCandidatesAtom = atom<Promise<Array<Profile>>>(
    async (get) => {
        const project = get(currentProjectAtom);
        return project
            ? getUserCandidates(get(dbClientAtom), project.id)
            : new Array<Profile>();
    }
);
