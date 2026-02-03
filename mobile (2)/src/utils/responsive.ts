// /home/natye/smart-tourism/utils/responsive.ts
import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on iPhone 11 scale (414x896)
const scale = SCREEN_WIDTH / 414;

export function normalize(size: number) {
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export function getResponsiveFontSize(baseSize: number) {
  const scaleFactor = SCREEN_WIDTH < 375 ? 0.9 : SCREEN_WIDTH > 768 ? 1.2 : 1;
  return normalize(baseSize * scaleFactor);
}

export function getResponsiveSpacing(baseSpacing: number) {
  const scaleFactor = SCREEN_WIDTH < 375 ? 0.8 : SCREEN_WIDTH > 768 ? 1.3 : 1;
  return normalize(baseSpacing * scaleFactor);
}

export function getResponsiveImageSize(percentage: number) {
  return SCREEN_WIDTH * percentage;
}

export const screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: SCREEN_WIDTH < 375,
  isMedium: SCREEN_WIDTH >= 375 && SCREEN_WIDTH <= 414,
  isLarge: SCREEN_WIDTH > 414 && SCREEN_WIDTH <= 768,
  isTablet: SCREEN_WIDTH > 768,
};

export const responsive = {
  fontSize: getResponsiveFontSize,
  spacing: getResponsiveSpacing,
  imageSize: getResponsiveImageSize,
  normalize,
  screen,
};