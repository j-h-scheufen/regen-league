import { List } from "grommet";
import { useRouter } from "next/router";

import { Project } from "../../utils/types";

type Props = {
  projects: Array<Project>;
};

export default function ProjectsList({ projects }: Props) {
  const router = useRouter();

  return (
    <List
      style={{ width: "100vw" }}
      data={projects}
      pad="medium"
      primaryKey="name"
      secondaryKey="description"
      onClickItem={(event: { item?: Project }) => {
        router.push("/project/" + event.item?.id);
      }}
    />
  );
}
