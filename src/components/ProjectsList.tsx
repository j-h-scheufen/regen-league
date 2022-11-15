import {List} from "grommet";
import {useRouter} from "next/router";

import {Project} from "../utils/supabase";

type Props = {
    projects: Array<Project>
}

export default function ProjectsList({projects}: Props) {
    const router = useRouter()

    return (
        <List data={projects} pad="medium"
          primaryKey='name'
          secondaryKey='description'
          onClickItem={(event: {item?: Project}) => { // @ts-ignore
              router.push("/project/"+event.item.id)}}>
        </List>
    )
}