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
import { EntityType, Project } from "../../utils/types";
import { atom, useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { currentProjectAtom } from "../../state/project";
import { updateEntity } from "../../utils/supabase";

type Props = {
    project: Project;
};

const emptyProject: Project = {
    type: EntityType.PROJECT,
    description: "",
    id: "",
    name: "",
};
const editProjectAtom = atom<Project>(emptyProject);
const loadingAtom = atom<boolean>(false);
const dirtyAtom = atom<boolean>(false);

export default function ProjectAttributesForm({ project }: Props) {
    if (!project) throw Error("This component requires a project");
    useHydrateAtoms([[editProjectAtom, { ...project }]] as const);
    const client = useSupabaseClient<Database>();
    const [editProject, setEditProject] = useAtom(editProjectAtom);
    const [loading, setLoading] = useAtom(loadingAtom);
    const [isDirty, setDirty] = useAtom(dirtyAtom);
    const [currentProject, setCurrentProject] = useAtom(currentProjectAtom);

    const updateProject = useCallback(async () => {
        try {
            setLoading(true);
            await updateEntity(client, editProject);
            setCurrentProject({ ...currentProject, ...editProject });
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [currentProject, editProject, setCurrentProject, client, setLoading]);

    return (
        <Card pad="small" margin={{ vertical: "small" }}>
            <CardHeader justify="center">
                <Text size="large">Project Attributes</Text>
            </CardHeader>
            <CardBody>
                <Box pad="small">
                    <Form<Project>
                        value={editProject}
                        onChange={(nextValue) => {
                            setEditProject(nextValue);
                            setDirty(true);
                        }}
                        onSubmit={() => {
                            updateProject().then(() => {
                                setDirty(false);
                            });
                        }}
                    >
                        <FormField
                            name="name"
                            htmlFor="nameId"
                            label="Name"
                            required
                        >
                            <TextInput id="nameId" name="name" type="name" />
                        </FormField>
                        <FormField
                            name="description"
                            htmlFor="descriptionId"
                            label="Description"
                        >
                            <TextArea
                                id="descriptionId"
                                name="description"
                                rows={5}
                            />
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
