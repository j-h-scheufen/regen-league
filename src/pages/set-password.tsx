import {Layer, Page} from "grommet";
import {User, useSupabaseClient} from "@supabase/auth-helpers-react";
import {useAtom} from "jotai";
import {useRouter} from "next/router";
import React, {useCallback} from "react";

import PasswordForm, {Mode} from "../components/profile/PasswordForm";
import {Database} from "../utils/database.types";
import {currentUserProfileAtom} from "../state/global";
import {getUserProfile} from "../utils/supabase";

export default function SetPasswordPage() {
    const router = useRouter()
    const client = useSupabaseClient<Database>()
    const [ , setCurrentProfile] = useAtom(currentUserProfileAtom)

    const initiateUser = useCallback(async (user: User) => {
        //TODO this page can be used for password resets in which case the initiate_user function should not be called
        console.log('Initiating user ID ', user.id)
        const {data, error} = await client.rpc('initiate_user', {user_id: user.id})
        if (error) {
            console.error('Unable to initiate the user profile for user ID '+user.id+'. Error: '+error.message)
            throw error
        }
        const profile = await getUserProfile(client, user.id)
        setCurrentProfile(profile)
    }, [client, setCurrentProfile])

    return (
        <Page align="center">
            <Layer
                id="setPasswordDialogModal"
                position="center"
            >
                <PasswordForm
                    mode={Mode.REGISTER}
                    onCancel={() => {}}
                    onSuccess={(user) => {
                        initiateUser(user).then(() => router.push('/profile'))
                    }}/>
            </Layer>
        </Page>
    )
}

