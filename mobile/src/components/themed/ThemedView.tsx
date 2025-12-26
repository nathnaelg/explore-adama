// /home/natye/smart-tourism/components/themed-view.tsx
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'bg');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}