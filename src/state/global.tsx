import { atom } from "jotai";
import {
    Facebook,
    Github,
    Instagram,
    Linkedin,
    Twitter,
    Youtube,
} from "grommet-icons";
import { Link as Generic } from "grommet-icons/icons";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseClient } from "@supabase/supabase-js";
import { Map as MapboxMap } from "mapbox-gl";

import {
    IconDictionary,
    LinkType,
    RegionCatalog,
    Profile,
    RegionAssociations,
    LinkDetails,
    MemberDetails,
    Role,
    RolesDictionary,
    EntityType,
    LocationEntity,
} from "../utils/types";

import {
    getCustomCatalog,
    getEPACatalog,
    getGeoJsonSource,
    getHubRoles,
    getLinkTypes,
    getOneEarthCatalog,
    getProjectRoles,
    getRolesDictionary,
} from "../utils/supabase";
import { FeatureCollection } from "geojson";

export const dbClientAtom = atom<SupabaseClient>((get) =>
    createBrowserSupabaseClient()
);

export const currentUserProfileAtom = atom<Profile | null>(null);

export const currentAvatarUrlAtom = atom<string>(
    (get) => get(currentUserProfileAtom)?.avatarURL || ""
);

export const currentEntityAtom = atom<LocationEntity | null>(null);

export const linkTypesAtom = atom<Promise<Array<LinkType>>>(async (get) => {
    return getLinkTypes(get(dbClientAtom));
});

export const rolesAtom = atom<Promise<RolesDictionary>>(async (get) => {
    return getRolesDictionary(get(dbClientAtom));
});

export const linkTypeIconsAtom = atom<IconDictionary>((get) => {
    const iconConfig: IconDictionary = {
        [1]: <Generic />,
        [2]: <Facebook />,
        [3]: <Instagram />,
        [4]: <Linkedin />,
        [5]: <Github />,
        [6]: <Twitter />,
        [7]: <Youtube />,
    };
    return iconConfig;
});

export const oneEarthCatalogAtom = atom<Promise<RegionCatalog>>(async (get) => {
    return getOneEarthCatalog(get(dbClientAtom));
});

export const oneEarthLabelsAtom = atom<Array<string>>(
    (get) => get(oneEarthCatalogAtom).labels
);

export const epaCatalogAtom = atom<Promise<RegionCatalog>>(async (get) => {
    return getEPACatalog(get(dbClientAtom));
});

export const epaLabelsAtom = atom<Array<string>>(
    (get) => get(epaCatalogAtom).labels
);

export const customCatalogAtom = atom<Promise<RegionCatalog>>(async (get) => {
    return getCustomCatalog(get(dbClientAtom));
});

export const hubRolesAtom = atom<Promise<Array<Role>>>(async (get) => {
    return getHubRoles(get(dbClientAtom));
});

export const projectRolesAtom = atom<Promise<Array<Role>>>(async (get) => {
    return getProjectRoles(get(dbClientAtom));
});

export const regionAssociationsAtom = atom<RegionAssociations | null>(null);

export const linkDetailsAtom = atom<Array<LinkDetails>>(
    new Array<LinkDetails>()
);

export const memberDetailsAtom = atom<Array<MemberDetails>>(
    new Array<MemberDetails>()
);

export const locationMapAtom = atom<MapboxMap | null>(null);

export const globalMapAtom = atom<MapboxMap | null>(null);

export const geoJsonHubsAtom = atom<Promise<FeatureCollection>>(async (get) => {
    return getGeoJsonSource(get(dbClientAtom), EntityType.HUB);
});

export const geoJsonProjectsAtom = atom<Promise<FeatureCollection>>(
    async (get) => {
        return getGeoJsonSource(get(dbClientAtom), EntityType.PROJECT);
    }
);

export const geoJsonPlatformsAtom = atom<Promise<FeatureCollection>>(
    async (get) => {
        return getGeoJsonSource(get(dbClientAtom), EntityType.PLATFORM);
    }
);

export const geoJsonPeopleAtom = atom<Promise<FeatureCollection>>(
    async (get) => {
        return getGeoJsonSource(get(dbClientAtom), EntityType.HUMAN);
    }
);
