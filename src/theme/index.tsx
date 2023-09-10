import { PropsWithChildren, useMemo } from 'react';
import { ColorScheme, MantineProvider, MantineThemeOverride } from '@mantine/core';

import { Direction, useThemeSettings } from '../store/settings.store';
import colors from './colors';

export const createThemeOptions = (
  mode: ColorScheme,
  direction: Direction
): MantineThemeOverride => ({
  colorScheme: mode,
  dir: direction,
  ...colors(mode),
  // typography, // TODO
  loader: 'dots',
});

export default function ThemeProvider({ children }: PropsWithChildren): JSX.Element {
  const themeSettings = useThemeSettings();

  const themeOptions: MantineThemeOverride = useMemo(
    () => createThemeOptions(themeSettings.colorScheme, themeSettings.direction),
    [themeSettings.colorScheme, themeSettings.direction]
  );

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={themeOptions}>
      {children}
    </MantineProvider>
  );
}
