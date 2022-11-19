import React, { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import {Avatar} from "grommet"
import {User} from "grommet-icons";

import { Database } from '../../utils/database.types'
import type {Profile} from '../../utils/types'
import {downloadAvatarImage} from "../../utils/supabase";
import {atom} from "jotai";
import {useAtom} from "jotai/esm";

type Props = {
    id: string
    url: Profile['avatarURL']
    size: string
    onUpload: (url: string) => void
}

const urlAtom = atom<string>('')
const isUploadingAtom = atom<boolean>(false)

export default function ProfileAvatar({id, url, size, onUpload}: Props) {
    const supabase = useSupabaseClient<Database>()
    const [avatarUrl, setAvatarUrl] = useAtom(urlAtom)
    const [uploading, setUploading] = useAtom(isUploadingAtom)

    if (url)
        setAvatarUrl(url)

    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${id}.${fileExt}`
            const filePath = `${fileName}`

            let { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (uploadError) {
                throw uploadError
            }

            onUpload(filePath)
        } catch (error) {
            console.error('Error uploading avatar! Error: '+JSON.stringify(error))
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            {avatarUrl ? (<Avatar src={avatarUrl} size="large"/>) :
                (<Avatar size="large" background="light-3"><User /></Avatar>)}
            <div>
                <label htmlFor="single">
                    {uploading ? 'Uploading ...' : 'Upload'}
                </label>
                <input
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                    }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                />
            </div>
        </div>
    )
}