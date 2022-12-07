import {atom} from 'jotai'
import {Facebook, Github, Instagram, Linkedin, Twitter, Youtube} from "grommet-icons";
import {Link as Generic} from "grommet-icons/icons";
import {createBrowserSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {SupabaseClient} from "@supabase/supabase-js";

import {
    IconDictionary,
    LinkType,
    RegionCatalog,
    Profile,
    RegionAssociations,
    LinkDetails,
    MemberDetails, Role, Project
} from "../utils/types";
import {
    getCustomCatalog,
    getEPACatalog,
    getHubRoles,
    getLinkTypes,
    getOneEarthCatalog,
    getProjectRoles
} from "../utils/supabase";

export const dbClientAtom = atom<SupabaseClient>((get) => createBrowserSupabaseClient())

export const currentUserProfileAtom = atom<Profile | null>(null)

export const currentAvatarUrlAtom = atom<string>((get) => get(currentUserProfileAtom)?.avatarURL || '')

export const linkTypesAtom = atom<Promise<Array<LinkType>>>(async (get) => {
    return getLinkTypes(get(dbClientAtom))
})

export const linkTypeIconsAtom = atom<IconDictionary>((get) => {
    const iconConfig: IconDictionary = {
        [1]: <Generic/>,
        [2]: <Facebook/>,
        [3]: <Instagram/>,
        [4]: <Linkedin/>,
        [5]: <Twitter/>,
        [6]: <Github/>,
        [7]: <Youtube/>,
    }
    return iconConfig
})

export const oneEarthCatalogAtom = atom<Promise<RegionCatalog>>(async (get) => {
    return getOneEarthCatalog(get(dbClientAtom))
})

export const oneEarthLabelsAtom = atom<Array<string>>((get) => get(oneEarthCatalogAtom).labels)

export const epaCatalogAtom = atom<Promise<RegionCatalog>>(async (get) => {
    return getEPACatalog(get(dbClientAtom))
})

export const epaLabelsAtom = atom<Array<string>>((get) => get(epaCatalogAtom).labels)

export const customCatalogAtom = atom<Promise<RegionCatalog>>(async (get) => {
    return getCustomCatalog(get(dbClientAtom))
})

export const hubRolesAtom = atom<Promise<Array<Role>>>(async (get) => {
    return getHubRoles(get(dbClientAtom))
})

export const projectRolesAtom = atom<Promise<Array<Role>>>(async (get) => {
    return getProjectRoles(get(dbClientAtom))
})

export const regionAssociationsAtom = atom<RegionAssociations | null>(null)

export const linkDetailsAtom = atom<Array<LinkDetails>>(new Array<LinkDetails>())

export const memberDetailsAtom = atom<Array<MemberDetails>>(new Array<MemberDetails>())
