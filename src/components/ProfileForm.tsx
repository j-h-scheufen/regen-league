import { useState } from 'react'
import {Box, Button, Form, FormField, TextInput} from "grommet";

export type Profile = {
  name: string
  description: string
}

type Props = {
  disabled: boolean
  profile?: Profile
  onCancel?: () => void
  onSave: (profile: Profile) => void
}

export default function NoteForm({ disabled, profile: initialProfile, onCancel, onSave }: Props) {
    const emptyProfile = { name: '', description: '' }
  const [profile, setProfile] = useState<Profile>(initialProfile ?? emptyProfile)

  return (
      <Box align="center" direction="column" pad="medium">
          <Form
              value={profile}
              onChange={nextValue => setProfile(nextValue)}
              onReset={() => setProfile(emptyProfile)}
              onSubmit={ (event) => { onSave(event.value) } }>
              <FormField name="name" htmlFor="nameId" label="Name" disabled={disabled}>
                  <TextInput id="nameId" name="name" />
              </FormField>
              <FormField name="description" htmlFor="descriptionId" label="Description" disabled={disabled}>
                  <TextInput id="descriptionId" name="description" />
              </FormField>
              <Box direction="row" gap="medium">
                  <Button type="submit" primary label="Submit" disabled={disabled} />
                  <Button type="reset" label="Reset" disabled={disabled} />
              </Box>
          </Form>
      </Box>
  )
}
