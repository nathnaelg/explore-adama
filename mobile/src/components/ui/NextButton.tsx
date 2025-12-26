// /home/natye/smart-tourism/components/ui/NextButton.tsx
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ThemedText } from '@/src/components/themed/ThemedText';

type NextButtonProps = {
  title: string;
  onPress: () => void;
  isLast?: boolean;
  fontSize?: number;
  paddingVertical?: number;
};

export function NextButton({ title, onPress, isLast, fontSize = 16, paddingVertical = 16 }: NextButtonProps) {
  const { width } = useWindowDimensions();
  const primaryColor = useThemeColor({}, 'primary');

  // Responsive calculations
  const isVerySmallScreen = width < 320;
  const isSmallScreen = width < 375;
  const isTablet = width > 768;
  
  const responsiveFontSize = fontSize;
  const responsivePadding = paddingVertical;
  const responsivePaddingHorizontal = isVerySmallScreen ? 16 : isSmallScreen ? 20 : isTablet ? 40 : 32;
  const responsiveHeight = isVerySmallScreen ? 44 : isSmallScreen ? 48 : 52;
  const responsiveBorderRadius = isVerySmallScreen ? 10 : 12;

  const styles = StyleSheet.create({
    button: {
      paddingVertical: responsivePadding,
      paddingHorizontal: responsivePaddingHorizontal,
      borderRadius: responsiveBorderRadius,
      width: '100%',
      minHeight: responsiveHeight,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: primaryColor,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonText: {
      color: 'white',
      fontWeight: '600' as const,
      fontSize: responsiveFontSize,
      textAlign: 'center',
    },
  });

  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ThemedText 
        type="default" 
        style={styles.buttonText}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}