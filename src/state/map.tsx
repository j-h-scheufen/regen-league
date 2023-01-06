import {atom} from "jotai";
import {Position} from "geojson";
import {getRelationshipCoordinates} from "../utils/supabase";
import {dbClientAtom, rolesAtom} from "./global";
import {EntityType} from "../utils/types";

export const projectToHubCoordinatesAtom = atom<Promise<Array<{source: Position, target: Position}>>>(async (get) => {
    const roles = get(rolesAtom).get(JSON.stringify([EntityType.PROJECT,EntityType.HUB]))
    if (roles !== undefined && roles.length > 0)
        return getRelationshipCoordinates(get(dbClientAtom), roles[0].id)
    return []
})