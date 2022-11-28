import { atom } from 'jotai'
import {Hub, LinkDetails, RegionAssociations} from "../utils/types";

export const editAtom = atom<boolean>(false)
export const isHubAdminAtom = atom<boolean>(false)
export const currentHubAtom = atom<Hub | null>(null)
export const currentHubLinks = atom<Array<LinkDetails>>(new Array<LinkDetails>())
export const currentHubRegionAssociations = atom<RegionAssociations | null>(null)