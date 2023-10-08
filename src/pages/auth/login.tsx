import { Box } from '@mantine/core';
import { Formik } from 'formik';

import MainLayout from '../../layouts/Main';

export default function LoginPage(): JSX.Element {
  return (
    <Box>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
      />
    </Box>
  );
}

LoginPage.getLayout = (page: React.ReactElement): JSX.Element => <MainLayout>{page}</MainLayout>;
