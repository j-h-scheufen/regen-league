import { MantineColorScheme } from '@mantine/core';
import { create } from 'zustand';

export type Direction = 'rtl' | 'ltr';

interface ThemeSettings {
  colorScheme: MantineColorScheme;
  direction: Direction;
}

interface SettingsState {
  theme: ThemeSettings;
}

interface SettingsActions {
  toggleThemeMode: () => void;
  toggleThemeDirection: () => void;
}

export type SettingsStore = SettingsState & { actions: SettingsActions };

const DEFAULT_OPTIONS: SettingsState = {
  theme: {
    colorScheme: 'dark',
    direction: 'ltr',
  },
};

const useSettingsStore = create<SettingsStore>()((set) => ({
  ...DEFAULT_OPTIONS,
  actions: {
    toggleThemeMode: (): void => {
      set((state) => ({
        theme: {
          ...state.theme,
          colorScheme: state.theme.colorScheme === 'light' ? 'dark' : 'light',
        },
      }));
    },
    toggleThemeDirection: (): void => {
      set((state) => ({
        theme: { ...state.theme, direction: state.theme.direction === 'ltr' ? 'rtl' : 'ltr' },
      }));
    },
  },
}));

export default useSettingsStore;

export const useThemeSettings = (): ThemeSettings => useSettingsStore((state) => state.theme);

export const useSettingsActions = (): SettingsActions => useSettingsStore((state) => state.actions);
