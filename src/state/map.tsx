import {atom} from "jotai";
import {Feature, Position} from "geojson";
import {getLinksForEntity, getLinkTypes, getRelationshipCoordinates} from "../utils/supabase";
import {dbClientAtom, rolesAtom} from "./global";
import {EntityType, LinkDetails, LocationEntity} from "../utils/types";

export const selectedFeatureAtom = atom<Feature | null>(null)

export const entitiesListAtom = atom<Array<LocationEntity>>([])

export const selectedEntityLinksAtom = atom<Promise<Array<LinkDetails>>>(async (get) => {
    const f = get(selectedFeatureAtom)
    if (f?.properties?.id)
        return getLinksForEntity(get(dbClientAtom), f.properties.id)
    return new Array<LinkDetails>()
})

export const projectToHubCoordinatesAtom = atom<Promise<Array<{source: Position, target: Position}>>>(async (get) => {
    const roles = get(rolesAtom).get(JSON.stringify([EntityType.PROJECT,EntityType.HUB]))
    if (roles !== undefined && roles.length > 0)
        return getRelationshipCoordinates(get(dbClientAtom), roles[0].id)
    return []
})