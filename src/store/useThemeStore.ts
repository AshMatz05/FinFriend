import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ThemeMode, lightColors, darkColors } from '../theme';

interface ThemeState {
  mode: ThemeMode;
  colors: typeof lightColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      colors: lightColors,
      toggleTheme: () =>
        set((state) => {
          const newMode = state.mode === 'light' ? 'dark' : 'light';
          return {
            mode: newMode,
            colors: newMode === 'light' ? lightColors : darkColors,
          };
        }),
      setTheme: (mode: ThemeMode) =>
        set({
          mode,
          colors: mode === 'light' ? lightColors : darkColors,
        }),
    }),
    {
      name: 'theme-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

