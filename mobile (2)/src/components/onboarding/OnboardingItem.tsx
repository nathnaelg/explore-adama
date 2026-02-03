// /home/natye/smart-tourism/components/OnboardingItem.tsx
import { ThemedText } from '@/src/components/themed/ThemedText';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { useTranslation } from 'react-i18next';
import { Image, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

export type OnboardingItemType = {
  id: number;
  title: string;
  description: string;
  image: any;
  action?: string;
};

type OnboardingItemProps = {
  item: OnboardingItemType;
  screenWidth?: number;
  screenHeight?: number;
};

export function OnboardingItem({ item, screenWidth, screenHeight }: OnboardingItemProps) {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const containerWidth = screenWidth || width;
  const containerHeight = screenHeight || height;

  const primaryColor = useThemeColor({}, 'primary');
  const mutedColor = useThemeColor({}, 'muted');

  // Responsive calculations
  const isSmallScreen = containerWidth < 375;
  const isVerySmallScreen = containerWidth < 320; // iPhone 5/SE
  const isTablet = containerWidth > 768;

  const getResponsiveImageSize = () => {
    if (isVerySmallScreen) return containerWidth * 0.65;
    if (isSmallScreen) return containerWidth * 0.75;
    if (isTablet) return containerWidth * 0.5;
    return containerWidth * 0.8;
  };

  const getResponsiveImageHeight = () => {
    if (isVerySmallScreen) return containerHeight * 0.3;
    if (isSmallScreen) return containerHeight * 0.35;
    if (isTablet) return containerHeight * 0.3;
    return containerHeight * 0.4;
  };

  const getResponsiveFontSize = (baseSize: number) => {
    if (isVerySmallScreen) return baseSize * 0.8;
    if (isSmallScreen) return baseSize * 0.85;
    if (isTablet) return baseSize * 1.2;
    return baseSize;
  };

  const getResponsiveSpacing = (baseSpacing: number) => {
    if (isVerySmallScreen) return baseSpacing * 0.6;
    if (isSmallScreen) return baseSpacing * 0.7;
    if (isTablet) return baseSpacing * 1.3;
    return baseSpacing;
  };

  const getResponsivePadding = (basePadding: number) => {
    if (isVerySmallScreen) return basePadding * 0.5;
    if (isSmallScreen) return basePadding * 0.8;
    if (isTablet) return basePadding * 1.2;
    return basePadding;
  };

  const getResponsiveLineHeight = (fontSize: number) => {
    if (isVerySmallScreen) return fontSize * 1.2;
    if (isSmallScreen) return fontSize * 1.3;
    return fontSize * 1.4;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: getResponsivePadding(16),
      paddingTop: getResponsiveSpacing(isVerySmallScreen ? 60 : isSmallScreen ? 80 : 100),
    },
    image: {
      width: getResponsiveImageSize(),
      height: getResponsiveImageHeight(),
      marginBottom: getResponsiveSpacing(isVerySmallScreen ? 20 : isSmallScreen ? 30 : 40),
      maxWidth: '100%',
    },
    textContainer: {
      alignItems: 'center',
      width: '100%',
      marginBottom: getResponsiveSpacing(30),
    },
    title: {
      fontSize: getResponsiveFontSize(24),
      fontWeight: 'bold' as const,
      textAlign: 'center' as const,
      marginBottom: getResponsiveSpacing(12),
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(24)),
      color: primaryColor,
      width: '100%',
      paddingHorizontal: getResponsivePadding(8),
      ...(Platform.OS === 'ios' ? {
        letterSpacing: -0.5
      } : {}),
    },
    description: {
      fontSize: getResponsiveFontSize(14),
      textAlign: 'center' as const,
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(14)),
      color: mutedColor,
      width: '100%',
      paddingHorizontal: getResponsivePadding(8),
      ...(isVerySmallScreen && {
        fontSize: getResponsiveFontSize(13),
        lineHeight: getResponsiveLineHeight(getResponsiveFontSize(13)),
      }),
    },
  });

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <Image
        source={item.image}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <ThemedText
          type="title"
          style={styles.title}
          numberOfLines={isVerySmallScreen ? 2 : 3}
          ellipsizeMode="tail"
        >
          {t(item.title)}
        </ThemedText>

        <ThemedText
          type="default"
          style={styles.description}
          numberOfLines={isVerySmallScreen ? 3 : 4}
          ellipsizeMode="tail"
        >
          {t(item.description)}
        </ThemedText>
      </View>
    </View>
  );
}