import { Colors } from '@/src/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { useColorScheme } from 'react-native';

export type ThemePreference = 'light' | 'dark' | 'system';

export const ThemeContext = React.createContext({
  isDark: false,
  colors: Colors.light,
  themePreference: 'system' as ThemePreference,
  setThemePreference: (theme: ThemePreference) => { },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreferenceState] = React.useState<ThemePreference>('system');

  React.useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_preference');
      if (savedTheme) {
        setThemePreferenceState(savedTheme as ThemePreference);
      }
    } catch (error) {
      console.error('Failed to load theme preference', error);
    }
  };

  const setThemePreference = async (theme: ThemePreference) => {
    try {
      setThemePreferenceState(theme);
      await AsyncStorage.setItem('theme_preference', theme);
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  };

  const isDark =
    themePreference === 'dark' ||
    (themePreference === 'system' && systemColorScheme === 'dark');

  return (
    <ThemeContext.Provider value={{
      isDark,
      colors: isDark ? Colors.dark : Colors.light,
      themePreference,
      setThemePreference,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}