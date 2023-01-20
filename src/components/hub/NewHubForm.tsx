import { Box, Button, Form, FormField, TextArea, TextInput } from "grommet";
import { useRouter } from "next/router";
import { atom, useAtom } from "jotai";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import { Database } from "../../utils/database.types";
import { EntityType, Hub } from "../../utils/types";
import { useCallback } from "react";
import { createEntityForUser } from "../../utils/supabase";
import { useAdminRole } from "../../utils/hooks";

const emptyHub: Hub = {
    id: "",
    name: "",
    description: "",
    type: EntityType.HUB,
};
const newHubAtom = atom<Hub>(emptyHub);
const loadingAtom = atom<boolean>(false);

export default function NewHubForm() {
    const client = useSupabaseClient<Database>();
    const user = useUser();
    const router = useRouter();
    const adminRole = useAdminRole(EntityType.HUMAN, EntityType.HUB);

    const [newHub, setHub] = useAtom(newHubAtom);
    const [loading, setLoading] = useAtom(loadingAtom);

    const createHub = useCallback(async (): Promise<string | undefined> => {
        try {
            setLoading(true);
            if (user) {
                const newEntity = await createEntityForUser(
                    client,
                    newHub,
                    user.id,
                    adminRole
                );
                setHub(newEntity);
                return newEntity.id;
            } else throw Error("No user session found.");
        } catch (error) {
            console.error("Error creating the hub!");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [client, user, adminRole, setLoading, newHub, setHub]);

    return (
        <Box width="large" elevation="medium" round pad="large">
            <Form<Hub>
                value={newHub}
                onChange={(newValue) => setHub(newValue)}
                onSubmit={() =>
                    createHub().then((hubId) => {
                        router.push("/hub/" + hubId);
                        setHub(emptyHub);
                    })
                }
            >
                <FormField
                    width="100%"
                    name="name"
                    htmlFor="nameId"
                    label="Name"
                    required
                >
                    <TextInput id="nameId" name="name" type="name" />
                </FormField>
                <FormField
                    width="100%"
                    name="description"
                    htmlFor="descriptionId"
                    label="Description"
                >
                    <TextArea id="descriptionId" name="description" rows={10} />
                </FormField>
                <Box
                    direction="row"
                    gap="medium"
                    width="50%"
                    margin={{ horizontal: "auto", top: "large" }}
                >
                    <Button
                        type="submit"
                        primary
                        label={loading ? "Loading ..." : "Submit"}
                        disabled={loading}
                    />
                </Box>
            </Form>
        </Box>
    );
}
