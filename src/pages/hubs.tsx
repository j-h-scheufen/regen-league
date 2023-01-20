import { Box, Button, Heading, Page } from "grommet";
import { Add as AddIcon } from "grommet-icons";
import { GetServerSidePropsContext } from "next";
import { Session, useSession } from "@supabase/auth-helpers-react";

import { getHubs, getServerClient } from "../utils/supabase";
import Link from "next/link";
import HubsList from "../components/hub/HubsList";
import { Hub } from "../utils/types";

type PageProps = {
    session: Session;
    hubs: Array<Hub>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const { client } = await getServerClient(ctx);

    const hubs = await getHubs(client);

    return {
        props: {
            hubs: hubs,
        },
    };
};

export default function Hubs({ hubs }: PageProps) {
    const session = useSession();

    return (
        <Page align="center">
            <Box direction="row" justify="between" align="center" width="95%">
                <Heading>Hubs</Heading>
                {session ? (
                    <Link href={"/hub/new"} passHref>
                        <Button margin={{ left: "auto" }}>
                            <AddIcon size="large" />
                        </Button>
                    </Link>
                ) : (
                    <Box />
                )}
            </Box>
            <Box margin={{ horizontal: "xsmall" }}>
                <HubsList hubs={hubs} />
            </Box>
        </Page>
    );
}
