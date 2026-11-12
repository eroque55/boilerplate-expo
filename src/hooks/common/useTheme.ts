import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';

export const useTheme = () => {
  const colorScheme = useColorScheme();

  const toggleTheme = () => {
    const newTheme: ColorSchemeName = colorScheme === 'dark' ? 'light' : 'dark';
    Appearance.setColorScheme(newTheme);
  };

  return {
    isDark: colorScheme === 'dark',
    toggleTheme,
  };
};
