import {Box, Button, Card, CardBody, CardHeader, Form, FormField, Heading, Layer, Select, Text} from 'grommet'
import {FormTrash} from "grommet-icons";
import Link from "next/link";
import {atom, useAtom, useAtomValue} from "jotai";
import {useSupabaseClient} from "@supabase/auth-helpers-react";

import {EntityType, Project} from "../../utils/types";
import {addProjectToHub, removeProjectFromHub} from "../../utils/supabase";
import {hubProjectCandidatesAtom, hubProjectsAtom} from "../../state/hub";
import React, {useCallback} from "react";
import {useHydrateAtoms} from "jotai/utils";
import ConfirmDialog from "../ConfirmDialog";

type Props = {
    hubId: string
}

type ProjectHolder = {
    project: Project
}

const emptyHolder: ProjectHolder = {project: {description: "", id: "", name: "", type: EntityType.PROJECT}}
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
                <ConfirmDialog
                    id="deleteProjectModal"
                    heading="Confirm"
                    text="Are you sure you want to remove this project from the hub?"
                    onCancel={() => setDeleteProject(null)}
                    onSubmit={handleProjectDelete}
                />
            )}
        </Card>
    )
}