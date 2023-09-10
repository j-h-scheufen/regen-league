import { ColorScheme } from '@mantine/core';

const COMMON = {
  primaryColor: 'lime',
  // Index of color from theme.colors that is considered primary, Shade type is 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  // primaryShade: { light: Shade; dark: Shade };
  // Default gradient used in components that support `variant="gradient"` (Button, ThemeIcon, etc.)
  defaultGradient: { deg: 4, from: 'lime', to: 'green' },
};

export default function colors(themeMode: ColorScheme) {
  const light = {
    ...COMMON,
  } as const;

  const dark = {
    ...COMMON,
  } as const;

  return themeMode === 'light' ? light : dark;
}
