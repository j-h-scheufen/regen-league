import {List} from "grommet";
import {useRouter} from "next/router";

import {Hub} from "../../utils/types";

type Props = {
    hubs: Array<Hub>
}

export default function HubsList({hubs}: Props) {
    const router = useRouter()

    return (
        <List data={hubs} pad="medium"
          primaryKey='name'
          secondaryKey='description'
          onClickItem={(event: {item?: Hub}) => {
              router.push("/hub/"+event.item?.id)}}>
        </List>
    )
}