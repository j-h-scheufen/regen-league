import { PropsWithChildren } from 'react';
import { MantineProvider } from '@mantine/core';

// import { useThemeSettings } from '../store/settings.store';
import theme from '.';

export default function ThemeProvider({ children }: PropsWithChildren): JSX.Element {
  // const themeSettings = useThemeSettings();

  return (
    <MantineProvider theme={theme}>
      {children}
    </MantineProvider>
  );
}
