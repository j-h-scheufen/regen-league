import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Text,
    Button,
    Layer,
    Heading,
    Form,
    FormField,
    Select
} from 'grommet'
import {FormTrash} from "grommet-icons";
import Link from "next/link";
import {atom, useAtom, useAtomValue} from "jotai";
import {useSupabaseClient} from "@supabase/auth-helpers-react";

import {Project} from "../../utils/types";
import {removeProjectFromHub, addProjectToHub} from "../../utils/supabase";
import {hubProjectsAtom, hubProjectCandidatesAtom} from "../../state/hub";
import {useCallback} from "react";
import {useHydrateAtoms} from "jotai/utils";

type Props = {
    hubId: string
}

type ProjectHolder = {
    project: Project
}

const emptyHolder: ProjectHolder = {project: {description: "", id: "", name: ""}}
const deleteProjectAtom = atom<Project | null>(null)
const addProjectAtom = atom<ProjectHolder>(emptyHolder)
const projectCandidatesAtom = atom<Array<Project>>(new Array<Project>())
const displayCandidatesAtom = atom<Array<Project>>(new Array<Project>())
const loadingAtom = atom<boolean>(false)

export default function ProjectConnectionsForm({ hubId }: Props) {
    const initialProjectCandidates = useAtomValue(hubProjectCandidatesAtom)
    const [projects, setProjects] = useAtom(hubProjectsAtom)
    useHydrateAtoms([
        [projectCandidatesAtom, initialProjectCandidates],
        [displayCandidatesAtom, initialProjectCandidates]] as const)

    const [projectCandidates, setProjectCandidates] = useAtom(projectCandidatesAtom)
    const [displayCandidates, setDisplayCandidates] = useAtom(displayCandidatesAtom)
    const [deleteProject, setDeleteProject] = useAtom(deleteProjectAtom)
    const [addProject, setAddProject] = useAtom(addProjectAtom)
    const [loading, setLoading] = useAtom(loadingAtom)
    const client = useSupabaseClient()


    const updateProjectCandidatesState = useCallback((projects: Array<Project>) => {
        setProjectCandidates(projects)
        setDisplayCandidates(projects)
    }, [setProjectCandidates, setDisplayCandidates])

    const handleProjectDelete = useCallback(async () => {
        if (deleteProject) {
            const id = deleteProject.id
            try {
                setLoading(true)
                await removeProjectFromHub(client, hubId, id)
                const newProjects = projects.filter(item => item.id !== id)
                setProjects([...newProjects])
                projectCandidates.push(deleteProject)
                setDeleteProject(null)
                updateProjectCandidatesState([...projectCandidates])
            } catch (error) {
                alert('Unable to remove project ID '+id+' from hub. Message: ' + JSON.stringify(error))
            } finally {
                setLoading(false)
            }
        }
    }, [client, hubId, deleteProject, projects, projectCandidates, setLoading, setProjects, setDeleteProject, updateProjectCandidatesState])

    const handleProjectAdd = useCallback( async () => {
        if(addProject) {
            const id = addProject.project.id
            try {
                setLoading(true)
                await addProjectToHub(client, hubId, id)
                const newCandidates = projectCandidates.filter(item => item.id !== id)
                projects.push(addProject.project)
                setProjects([...projects])
                setAddProject(emptyHolder)
                updateProjectCandidatesState([...newCandidates])
            }
            catch (error) {
                alert('Unable to add project with ID '+id+' to hub. Message: '+JSON.stringify(error))
            }
            finally {
                setLoading(false)
            }
        }
    }, [client, hubId, addProject, projects, projectCandidates, setLoading, setProjects, setAddProject, updateProjectCandidatesState])

    const ProjectRow = (p: Project) => {
        return (
            <Box direction="row" gap="medium" pad="small" flex>
                <Link href={'/project/'+p.id}>{p.name}</Link>
                <Button
                    margin={{left: 'auto'}}
                    onClick={() => setDeleteProject(p)}>
                    <FormTrash/>
                </Button>
            </Box>
        )
    }

    return (
        <Card pad="small" margin={{vertical: "small"}}>
            <CardHeader justify="center"><Text size="large">Projects</Text></CardHeader>
            <CardBody>
                    <Box pad="small" margin={{bottom: "small"}}>
                        <Form<ProjectHolder>
                            value={addProject}
                            onChange={(nextValue) => setAddProject(nextValue)}
                            onSubmit={() => handleProjectAdd()}
                        >
                            <Box direction="row">
                                <FormField name="project" htmlFor="projectSelectId" label="Project" width="100%" required>
                                    <Select
                                        id="projectSelectId"
                                        name="project"
                                        valueKey="id"
                                        labelKey="name"
                                        options={displayCandidates}
                                        onSearch={(text) => {
                                            // The line below escapes regular expression special characters:
                                            // [ \ ^ $ . | ? * + ( )
                                            const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
                                            // Create the regular expression with modified value which
                                            // handles escaping special characters. Without escaping special
                                            // characters, errors will appear in the console
                                            const exp = new RegExp(escapedText, 'i');
                                            if (projectCandidates)
                                                setDisplayCandidates(projectCandidates.filter((p) => exp.test(p.name || p.id)));
                                        }}
                                    />
                                </FormField>
                                <Button
                                    primary
                                    type="submit"
                                    label={loading ? 'Loading ...' : 'Add'}
                                    disabled={loading}
                                    alignSelf="center"
                                    margin={{left: "small"}}/>
                            </Box>
                        </Form>
                    </Box>
                {projects.map((item, index) => <ProjectRow key={index} {...item}/>)}
            </CardBody>
            {deleteProject && (
                <Layer
                    id="deleteLinkModal"
                    position="center"
                    onClickOutside={() => setDeleteProject(null)}
                    onEsc={() => setDeleteProject(null)}
                    animation="fadeIn"
                >
                    <Box pad="medium" gap="small" width="medium">
                        <Heading level={3} margin="none">Confirm</Heading>
                        <Text>Are you sure you want to remove this project from the hub?</Text>
                        <Box
                            as="footer"
                            gap="small"
                            direction="row"
                            align="center"
                            justify="end"
                            pad={{ top: 'medium', bottom: 'small' }}
                        >
                            <Button label="Cancel" onClick={() => setDeleteProject(null)} color="dark-3" />
                            <Button
                                label={
                                    <Text color="white">
                                        <strong>Delete</strong>
                                    </Text>
                                }
                                onClick={() => handleProjectDelete()}
                                primary
                                color="status-critical"
                            />
                        </Box>
                    </Box>
                </Layer>
            )}
        </Card>
    )
}