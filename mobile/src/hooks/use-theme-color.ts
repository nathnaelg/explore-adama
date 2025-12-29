import { Colors } from '@/src/constants/Colors';
import { useTheme } from '../providers/ThemeProvider';

type ColorScheme = 'light' | 'dark';
type ColorName = keyof typeof Colors.light;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorName
) {
  const { isDark, colors } = useTheme();
  const theme = isDark ? 'dark' : 'light';

  if (props[theme]) {
    return props[theme];
  } else {
    return colors[colorName as keyof typeof colors];
  }
}
