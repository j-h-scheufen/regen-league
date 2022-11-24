import {Card, CardHeader, List} from 'grommet'
import {useRouter} from "next/router";

import {MembershipItem} from "../../utils/types";

type Props = {
    title: string,
    subpage: string,
    items: Array<MembershipItem>
}

export default function MembershipCard({title, subpage, items}: Props) {
    const router = useRouter()

    return (
        <Card pad="small">
            <CardHeader pad="small">{title}</CardHeader>
            <List data={items}
                  primaryKey="name"
                  secondaryKey="role"
                  onClickItem={(event: {item?: MembershipItem}) => {
                      router.push("/"+subpage+"/"+event.item?.id)}}/>
        </Card>
    )
}