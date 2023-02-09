import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormField,
  Text,
  TextArea,
  TextInput,
} from "grommet";
import { useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { Database } from "../../utils/database.types";
import { EntityType, Hub } from "../../utils/types";
import { atom, useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { currentHubAtom } from "../../state/hub";
import { updateEntity } from "../../utils/supabase";

// const FormSection = ({ children, ...rest }: PropsWithChildren<BoxProps>) => (
//     <Box direction="row" gap="medium" justify="center" margin={{ bottom: 'medium' }} {...rest}>
//         {children}
//     </Box>
// )

type Props = {
  hub: Hub;
};

const emptyHub: Hub = {
  type: EntityType.HUB,
  description: "",
  id: "",
  name: "",
};
const editHubAtom = atom<Hub>(emptyHub);
const loadingAtom = atom<boolean>(false);
const dirtyAtom = atom<boolean>(false);

export default function HubAttributesForm({ hub }: Props) {
  if (!hub) throw Error("This component requires a hub");
  useHydrateAtoms([[editHubAtom, { ...hub }]] as const);
  const client = useSupabaseClient<Database>();
  const [editHub, setEditHub] = useAtom(editHubAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [isDirty, setDirty] = useAtom(dirtyAtom);
  const [currentHub, setCurrentHub] = useAtom(currentHubAtom);

  const updateHub = useCallback(async () => {
    try {
      setLoading(true);
      await updateEntity(client, editHub);
      setCurrentHub({ ...currentHub, ...editHub });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [currentHub, editHub, setCurrentHub, client, setLoading]);

  return (
    <Card pad="small" margin={{ vertical: "small" }}>
      <CardHeader justify="center">
        <Text size="large">Hub Attributes</Text>
      </CardHeader>
      <CardBody>
        <Box pad="small">
          <Form<Hub>
            value={editHub}
            onChange={(nextValue) => {
              setEditHub(nextValue);
              setDirty(true);
            }}
            onSubmit={() => {
              updateHub().then(() => {
                setDirty(false);
              });
            }}
          >
            <FormField name="name" htmlFor="nameId" label="Name" required>
              <TextInput id="nameId" name="name" type="name" />
            </FormField>
            <FormField
              name="description"
              htmlFor="descriptionId"
              label="Description"
            >
              <TextArea id="descriptionId" name="description" rows={5} />
            </FormField>
            <Box
              direction="row"
              gap="medium"
              justify="end"
              margin={{ right: "small", vertical: "medium" }}
            >
              <Button
                type="submit"
                primary
                label={loading ? "Loading ..." : "Update"}
                disabled={loading || !isDirty}
              />
            </Box>
          </Form>
        </Box>
      </CardBody>
    </Card>
  );
}
