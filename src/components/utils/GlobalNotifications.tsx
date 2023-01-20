import { Notification } from "grommet";
import React from "react";
import { atom, useAtomValue, useAtom, Atom } from "jotai";

import { currentUserProfileAtom } from "../../state/global";
import { UserStatus } from "../../utils/types";

type NotificationConfig = {
    type: string;
    title?: string;
    message: string;
    actions: Array<{ href: string; label: string }>;
    show: () => boolean;
};

type ConfigDictionary = Record<string, NotificationConfig>;
const initialConfig: ConfigDictionary = {
    ["onboarding_reminder"]: {
        type: "warning",
        message: "Your onboarding process has not been completed!",
        actions: [{ href: "/onboarding", label: "Continue Onboarding" }],
        show: () => {
            // const currentProfile = useAtomValue(currentUserProfileAtom)
            // return currentProfile?.status == UserStatus.ONBOARDING
            return false;
        },
    },
};

const configStoreAtom = atom<ConfigDictionary>(initialConfig);

export default function GlobalNotifications() {
    const [config, setConfig] = useAtom(configStoreAtom);

    // config.entries()

    return {};
    // <Notification
    //     status="warning"
    //     message={``}
    //     title={}
    //     onClose={() => setShowGlobalNotifications(false)}
    //     actions={[
    //         {href: '/onboarding', label: 'Continue Onboarding'},
    //     ]}
    //     global
    // />
}
