/**
 * @generated SignedSource<<6ff5e2bf5bffd4d8eadd298243da6059>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ProfileEntityType = "ENTITY" | "PERSON" | "%future added value";
export type CreateProfileInput = {
  clientMutationId?: string | null;
  content: ProfileInput;
};
export type ProfileInput = {
  description?: string | null;
  entityType?: ProfileEntityType | null;
  name: string;
};
export type CreateProfileMutation$variables = {
  input: CreateProfileInput;
};
export type CreateProfileMutation$data = {
  readonly createProfile: {
    readonly document: {
      readonly id: string;
    };
  } | null;
};
export type CreateProfileMutation = {
  response: CreateProfileMutation$data;
  variables: CreateProfileMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "CreateProfilePayload",
    "kind": "LinkedField",
    "name": "createProfile",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Profile",
        "kind": "LinkedField",
        "name": "document",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateProfileMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateProfileMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "48c0889bc05129936805890cb210ba82",
    "id": null,
    "metadata": {},
    "name": "CreateProfileMutation",
    "operationKind": "mutation",
    "text": "mutation CreateProfileMutation(\n  $input: CreateProfileInput!\n) {\n  createProfile(input: $input) {\n    document {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "0f3138458b72b8ae42c4171b46c67221";

export default node;
