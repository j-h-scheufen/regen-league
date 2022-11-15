import React, { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Database } from '../utils/database.types'
import {Avatar} from "grommet"
import {User} from "grommet-icons";

import type {Profile} from '../utils/supabase'
import {downloadAvatarImage} from "../utils/supabase";

export default function ProfileAvatar({
                                   uid,
                                   url,
                                   size,
                                   onUpload,
                               }: {
    uid: string
    url: Profile['avatar_url']
    size: number
    onUpload: (url: string) => void
}) {
    const supabase = useSupabaseClient<Database>()
    const [avatarUrl, setAvatarUrl] = useState<string>()
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (url)
            downloadAvatarImage(supabase, url, setAvatarUrl)
    }, [url])

    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${uid}.${fileExt}`
            const filePath = `${fileName}`

            let { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (uploadError) {
                throw uploadError
            }

            onUpload(filePath)
        } catch (error) {
            alert('Error uploading avatar! Error: '+JSON.stringify(error))
            console.log(error)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            {avatarUrl ? (<Avatar src={avatarUrl} size="large"/>) :
                (<Avatar size="large" background="light-3"><User /></Avatar>)}
            <div style={{ width: size }}>
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