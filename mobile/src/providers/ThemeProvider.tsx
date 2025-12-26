import { Colors } from '@/src/constants/Colors';
import React from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = React.createContext({
  isDark: false,
  colors: Colors.light,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <ThemeContext.Provider value={{
      isDark,
      colors: isDark ? Colors.dark : Colors.light,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}