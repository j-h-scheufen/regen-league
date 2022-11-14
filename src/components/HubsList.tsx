import {List} from "grommet";
import {User} from "@supabase/auth-helpers-react";
import {useRouter} from "next/router";

import {Hub} from "../utils/supabase";

type Props = {
    hubs: Array<Hub>
}

export default function HubsList({hubs}: Props) {
    const router = useRouter()

    return (
        <List data={hubs} pad="medium"
          primaryKey='name'
          secondaryKey='description'
          onClickItem={(event: {item?: Hub}) => { // @ts-ignore
              router.push("/hub/"+event.item.id)}}>
        </List>
    )
}