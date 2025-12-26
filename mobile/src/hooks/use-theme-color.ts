import { Colors } from '@/src/constants/Colors';
import { useColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark';
type ColorName = keyof typeof Colors.light;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorName
) {
  const theme = useColorScheme() as ColorScheme;
  return props[theme] ?? Colors[theme][colorName];
}
