import { useThemeStore } from '../store/useThemeStore';

export const useTheme = () => {
  const colors = useThemeStore((state) => state.colors);
  const mode = useThemeStore((state) => state.mode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return { colors, mode, toggleTheme, setTheme };
};

