import { atom } from 'jotai'
import {Hub} from "../utils/types";

export const editAtom = atom<boolean>(false)
export const isHubAdminAtom = atom<boolean>(false)
export const currentHubAtom = atom<Hub | null>(null)
