import React from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Box, FileInput, Form } from "grommet";

import { Database } from "../../utils/database.types";
import { atom, useAtom } from "jotai";
import { updateAvatarFile } from "../../utils/supabase";
import ProfileAvatar from "./ProfileAvatar";
import { useHydrateAtoms } from "jotai/utils";

type Props = {
    avatarURL?: string;
    onUpload: (filename: string, url: string) => void;
};

const isUploadingAtom = atom<boolean>(false);
const avatarUrlAtom = atom<string>("");

export default function AvatarUpload({ avatarURL, onUpload }: Props) {
    useHydrateAtoms([[avatarUrlAtom, avatarURL]] as const);
    const supabase = useSupabaseClient<Database>();
    const user = useUser();
    const [uploading, setUploading] = useAtom(isUploadingAtom);
    const [currentUrl, setAvatarUrl] = useAtom(avatarUrlAtom);

    const uploadAvatar = async (
        event: React.ChangeEvent<HTMLInputElement> | undefined
    ) => {
        try {
            setUploading(true);

            if (!event?.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event?.target.files[0];
            const fileExt = file.name.split(".").pop();
            const fileName = `${user!.id}.${fileExt}`;
            const filePath = `${fileName}`;

            const update = await updateAvatarFile(
                supabase,
                user!.id,
                filePath,
                file
            );
            setAvatarUrl(update.url);
            onUpload(update.filename, update.url);
        } catch (error) {
            console.error(
                "Error uploading avatar! Error: " + JSON.stringify(error)
            );
            throw error;
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box align="center" pad="medium">
            <ProfileAvatar avatarURL={currentUrl} size="large" />
            <FileInput
                name="file"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={uploading}
            />
        </Box>
    );
}
