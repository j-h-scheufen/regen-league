import { atom } from 'jotai'
import {Profile} from "../utils/types";

export const currentUserProfile = atom<Profile | null>(null)
export const currentAvatarUrl = atom<string>((get) => get(currentUserProfile)?.avatarURL || '')