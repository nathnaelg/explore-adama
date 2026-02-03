import { Colors } from '@/src/constants/Colors';
import { Animated, StyleSheet, useColorScheme, useWindowDimensions, View } from 'react-native';

type PaginatorProps = {
  data: any[];
  scrollX: Animated.Value;
  dotSize?: number;
  activeDotWidth?: number;
  dotSpacing?: number;
};

export function Paginator({ data, scrollX, dotSize = 8, activeDotWidth = 24, dotSpacing = 4 }: PaginatorProps) {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  // Responsive calculations
  const isSmallScreen = width < 375;
  const isTablet = width > 768;
  
  const responsiveDotSize = isSmallScreen ? dotSize * 0.9 : isTablet ? dotSize * 1.2 : dotSize;
  const responsiveActiveWidth = isSmallScreen ? activeDotWidth * 0.9 : isTablet ? activeDotWidth * 1.2 : activeDotWidth;
  const responsiveSpacing = isSmallScreen ? dotSpacing * 0.8 : isTablet ? dotSpacing * 1.5 : dotSpacing;

  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [responsiveDotSize, responsiveActiveWidth, responsiveDotSize],
          extrapolate: 'clamp',
        });
        
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i.toString()}
            style={[
              styles.dot,
              {
                width: dotWidth,
                height: responsiveDotSize,
                opacity: opacity,
                backgroundColor: colors.primary,
                marginHorizontal: responsiveSpacing,
                borderRadius: responsiveDotSize / 2,
              },
            ]}
          />
        );
      })}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});