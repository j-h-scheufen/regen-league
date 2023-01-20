import React, { useCallback } from "react";
import { Box, Button, Form, FormField, TextInput } from "grommet";
import { User, useSupabaseClient } from "@supabase/auth-helpers-react";
import { atom, useAtom } from "jotai";

import { Database } from "../../utils/database.types";

export enum Mode {
  REGISTER,
  CHANGE_PASSWORD,
}

type Props = {
  mode: Mode;
  onSuccess: (user: User) => void;
  onCancel: () => void;
};

type NewPassword = {
  pwd1: string;
  pwd2: string;
};

const emptyNewPassword: NewPassword = { pwd1: "", pwd2: "" };
const newPasswordAtom = atom<NewPassword>(emptyNewPassword);
const oldPasswordValidatedAtom = atom<boolean>(false);

const loadingAtom = atom<boolean>(false);

export default function PasswordForm({ mode, onSuccess, onCancel }: Props) {
  const client = useSupabaseClient<Database>();
  const [loading, setLoading] = useAtom(loadingAtom);
  const [newPassword, setNewPassword] = useAtom(newPasswordAtom);
  const [oldPasswordValidated, setOldPasswordValidated] = useAtom(
    oldPasswordValidatedAtom
  );

  const setUserPassword = useCallback(async (): Promise<User> => {
    try {
      setLoading(true);
      const { data, error } = await client.auth.getSession();
      const userId = data.session?.user.id;
      console.log("Updating user: ", userId);
      const updateResult = await client.auth.updateUser({
        password: newPassword.pwd1,
      });
      if (updateResult.error) {
        console.log("Error setting password for user ID " + userId);
        throw updateResult.error;
      }
      return updateResult.data.user;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client, newPassword, setLoading]);

  const validateNewPassword = () => {
    //TODO need regex and password rules
    return (
      newPassword.pwd1.length >= 8 && newPassword.pwd1 === newPassword.pwd2
    );
  };

  return (
    <Box pad="small">
      <Form<NewPassword>
        value={newPassword}
        onChange={(nextValue) => setNewPassword(nextValue)}
        onSubmit={() => {
          setUserPassword().then((user) => {
            onSuccess(user);
          });
        }}
      >
        <FormField name="pwd1" htmlFor="pwd1Id" label="New Password">
          <TextInput
            id="pwd1Id"
            name="pwd1"
            type="password"
            placeholder="Ul3$%_5Ktss75"
          />
        </FormField>
        <FormField name="pwd2" htmlFor="pwd2Id" label="Repeat Password">
          <TextInput
            id="pwd2Id"
            name="pwd2"
            type="password"
            placeholder="Ul3$%_5Ktss75"
          />
        </FormField>
        <Box
          direction="row"
          gap="medium"
          margin={{ top: "medium" }}
          justify="end"
        >
          {mode != Mode.REGISTER && (
            <Button
              secondary
              label={loading ? "Loading ..." : "Cancel"}
              disabled={loading}
              onClick={() => onCancel()}
            />
          )}
          <Button
            primary
            type="submit"
            label={loading ? "Loading ..." : "Submit"}
            disabled={!validateNewPassword() || loading}
          />
        </Box>
      </Form>
    </Box>
  );
}
