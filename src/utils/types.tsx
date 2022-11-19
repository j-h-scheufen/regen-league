
export type Hub = {
    id: string,
    name: string,
    description: string,
    bioregionId: number | null
}

export type Project = {
    id: string,
    name: string,
    description: string,
    bioregionId: number | null
}

export type Profile = {
    id: string,
    username: string,
    avatarURL: string
}

export type Bioregion = {
    id: number,
    code: string,
    name: string,
    link: string,
}

export type Subrealm = {
    id: number,
    name: string,
}

export type Realm = {
    id: number,
    name: string,
    link: string
}

export type Ecoregion = {
    id: number,
    name: string,
    link: string,
}

export type BioregionInfo = {
    ecoregion?: Ecoregion, // ecoregion is optional for now
    bioregion: Bioregion,
    subrealm: Subrealm,
    realm: Realm
}

export type MemberDetails = {
    userId: string,
    username: string,
    avatarImage: string,
    roleName: string,
    avatarURL: string
}

export type MembershipItem = {
    id: string,
    name: string,
    description: string,
    role: string
}

export type LinkDetails = {
    url: string,
    type: string
}
