import { useAtomValue } from "jotai";
import { rolesAtom } from "../state/global";
import { EntityType } from "./types";

export function useAdminRole(fromType: EntityType, toType: EntityType): string {
  const rolesDictionary = useAtomValue(rolesAtom);
  const roles = rolesDictionary.get(JSON.stringify([fromType, toType]));
  if (roles) {
    const length = roles.length;
    for (let i = 0; i < length; i++) {
      if (roles[i].name.toUpperCase().startsWith("ADMIN")) return roles[i].id;
    }
  }
  console.error(
    "No admin role found for a relationship from type: " +
      fromType +
      " to type: " +
      toType
  );
  throw Error("Missing data. Unable to proceed");
}
