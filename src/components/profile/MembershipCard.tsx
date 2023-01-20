import { Card, CardHeader, List } from "grommet";
import { useRouter } from "next/router";

import { EntityMember } from "../../utils/types";

type Props = {
  title: string;
  subpage: string;
  items: Array<EntityMember>;
};

export default function MembershipCard({ title, subpage, items }: Props) {
  const router = useRouter();

  return (
    <Card pad="small">
      <CardHeader pad="small">{title}</CardHeader>
      <List
        data={items}
        primaryKey="name"
        secondaryKey="role"
        onClickItem={(event: { item?: EntityMember }) => {
          router.push("/" + subpage + "/" + event.item?.id);
        }}
      />
    </Card>
  );
}
