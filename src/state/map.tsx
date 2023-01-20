import { atom } from "jotai";
import { Feature, Position } from "geojson";

import {
    getLinksForEntity,
    getRelationshipCoordinates,
} from "../utils/supabase";
import { dbClientAtom, rolesAtom, currentEntityAtom } from "./global";
import { EntityType, LinkDetails, LocationEntity } from "../utils/types";

export const selectedFeatureAtom = atom<Feature | null>(null);

export const entitiesListAtom = atom<Array<LocationEntity>>([]);

export const entitiesMapAtom = atom<Map<string, LocationEntity>>((get) => {
    const result = new Map<string, LocationEntity>();
    get(entitiesListAtom).forEach((entity) => result.set(entity.id, entity));
    return result;
});

export const selectedEntityLinksAtom = atom<Promise<Array<LinkDetails>>>(
    async (get) => {
        const e = get(currentEntityAtom);
        if (e) return getLinksForEntity(get(dbClientAtom), e.id);
        return new Array<LinkDetails>();
    }
);

export const projectToHubCoordinatesAtom = atom<
    Promise<Array<{ source: Position; target: Position }>>
>(async (get) => {
    const roles = get(rolesAtom).get(
        JSON.stringify([EntityType.PROJECT, EntityType.HUB])
    );
    if (roles !== undefined && roles.length > 0)
        return getRelationshipCoordinates(get(dbClientAtom), roles[0].id);
    return [];
});
