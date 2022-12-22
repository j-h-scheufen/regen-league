import {Position} from "geojson";

export enum UserStatus {
    ONBOARDING = 1,
    ACTIVE = 2,
    BLOCKED = 3,
    DELETED = 4
}

export enum EntityType {
    PROJECT = 1,
    HUB = 2,
    PLATFORM = 3,
    HUMAN = 4
}

export type Entity = {
    id: string,
    name: string,
    description: string,
    type: EntityType,
}

export type LocationEntity = Entity & {
    position?: Position,
    polygon?: string | null
}

export type Hub = LocationEntity

export type Project = LocationEntity

export type Profile = {
    id: string,
    username: string,
    avatarFilename?: string,
    avatarURL?: string
    status: UserStatus
}

export type RelationDetails = {
    fromId: string,
    toId: string,
    roleId: string,
    roleName: string,
}

export type MemberDetails = {
    userId: string,
    username: string,
    roleName: string,
    avatarFilename?: string,
    avatarURL?: string
}

export type EntityMember = Entity & {
    roleName: string
}

export type Role = {
    id: string
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

export type RoleKey = {
    fromType: EntityType,
    toType: EntityType
}

export type RolesDictionary = Map<RoleKey, Array<Role>>

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
    labels: Array<string>
    level1: Array<RegionNode>
    level2: Array<RegionNode>
    level3: Array<RegionNode>
    level4: Array<RegionNode>
}

//#########################
// Type Guards

export function isLocationEntity(e: Entity | LocationEntity): e is LocationEntity {
    return (e as LocationEntity).position !== undefined;
}