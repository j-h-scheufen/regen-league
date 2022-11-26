
export type IconDictionary = Record<number, JSX.Element>

export type Profile = {
    id: string,
    username: string,
    avatarFilename: string,
    avatarURL: string
}

export type Hub = {
    id: string,
    name: string,
    description: string,

}

export type Project = {
    id: string,
    name: string,
    description: string,
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
    id: number,
    url: string,
    typeId: number
}

export type LinkType = {
    id: number
    name: string
}

export type RegionNode = {
    id: number
    name: string
    parent?: number
}

export type RegionAssociations = {
    oneEarth: OneEarthInfo | null
    epa: EPAInfo | null
    custom: Array<RegionNode>
}

//////////////////////////////
// ONE EARTH
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

export type OneEarthInfo = {
    ecoregion?: Ecoregion, // ecoregion is optional for now
    bioregion: Bioregion,
    subrealm: Subrealm,
    realm: Realm
}

export type OneEarthCatalog = {
    realms: Array<RegionNode>
    subrealms: Array<RegionNode>
    bioregions: Array<RegionNode>
    ecoregions: Array<RegionNode>
}

//////////////////////////////
// EPA Regions

export type EPARegion = RegionNode & {
    level: number
}

export type EPAInfo = {
    level1: EPARegion
    level2: EPARegion
    level3: EPARegion
    level4: EPARegion
}