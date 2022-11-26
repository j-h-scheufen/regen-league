import { atom } from 'jotai'
import {IconDictionary, LinkType, Profile} from "../utils/types";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {getLinkTypes} from "../utils/supabase";
import {Facebook, Github, Instagram, Linkedin, Twitter, Youtube} from "grommet-icons";
import {Link as Generic} from "grommet-icons/icons";

export const currentUserProfileAtom = atom<Profile | null>(null)
export const currentAvatarUrlAtom = atom<string>((get) => get(currentUserProfileAtom)?.avatarURL || '')

export const linkTypesAtom = atom<Promise<Array<LinkType>>>(async (get) => {
    const client = useSupabaseClient()
    return getLinkTypes(client)
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

