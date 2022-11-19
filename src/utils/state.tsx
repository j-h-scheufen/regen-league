import { atom } from 'jotai'
import {Profile} from "./types";

export const currentUserProfile = atom<Profile | null>(null)
export const isHubAdminAtom = atom<boolean>(false)
export const isProjectAdminAtom = atom<boolean>(false)
