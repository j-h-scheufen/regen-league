
export enum UserStatus {
    ONBOARDING,
    ACTIVE,
    BLOCKED,
    DELETED
}

export type Profile = {
    id: string,
    username: string,
    avatarFilename?: string,
    avatarURL?: string
    status: UserStatus
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
    roleName: string,
    avatarFilename?: string,
    avatarURL?: string
}

export type MembershipItem = {
    id: string,
    name: string,
    description: string,
    role: string
}

export type Role = {
    id: number
    name: string
    description: string
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

export type IconDictionary = Record<number, JSX.Element>

//////////////////////////////
// ONE EARTH & EPA Regions
export type RegionNode = {
    id: number | string
    name: string
    level: number
    code?: string
    link?: string
    description?: string
    parentId?: number | string
}

export type RegionAssociations = {
    oneEarth: RegionInfo | null
    epa: RegionInfo | null
    custom: RegionInfo | null
}

export type RegionInfo = Array<RegionNode>

export type RegionCatalog = {
    level1: Array<RegionNode>
    level2: Array<RegionNode>
    level3: Array<RegionNode>
    level4: Array<RegionNode>
}

