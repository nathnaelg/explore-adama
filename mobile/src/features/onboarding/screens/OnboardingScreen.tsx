
import { OnboardingItem } from '@/src/components/onboarding/OnboardingItem';
import { Paginator } from '@/src/components/onboarding/Paginator';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { NextButton } from '@/src/components/ui/NextButton';
import { onboardingData } from '@/src/constants/OnboardingData';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Animated,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';

export default function OnboardingScreen() {
    const { t } = useTranslation();
    const { width, height } = useWindowDimensions();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList>(null);

    // Responsive scaling factors
    const isSmallScreen = width < 375; // iPhone SE, small Android
    const isLargeScreen = width > 414; // Large phones (iPhone Pro Max, etc.)
    const isTablet = width > 768;

    // Responsive calculations
    const getResponsiveValue = (value: number, smallFactor = 0.9, largeFactor = 1.1) => {
        if (isSmallScreen) return value * smallFactor;
        if (isLargeScreen) return value * largeFactor;
        return value;
    };

    const getResponsivePadding = () => {
        if (isSmallScreen) return 16;
        if (isTablet) return 32;
        return 20;
    };

    const getResponsiveFontSize = (baseSize: number) => {
        if (isSmallScreen) return baseSize * 0.9;
        if (isTablet) return baseSize * 1.2;
        return baseSize;
    };

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems[0]) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleNext = async () => {
        if (currentIndex < onboardingData.length - 1) {
            const nextIndex = currentIndex + 1;
            const offset = nextIndex * width;

            slidesRef.current?.scrollToOffset({
                offset,
                animated: true,
            });

            setTimeout(() => {
                setCurrentIndex(nextIndex);
            }, 300);
        } else {
            await handleSkip();
        }
    };

    const handleSkip = async () => {
        try {
            // Save that user has seen onboarding
            await AsyncStorage.setItem('@adama_onboarding_seen', 'true');
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Error saving onboarding status:', error);
            router.replace('/(auth)/login');
        }
    };

    const handleSkipToEnd = () => {
        const lastIndex = onboardingData.length - 1;
        slidesRef.current?.scrollToIndex({
            index: lastIndex,
            animated: true,
        });
        setCurrentIndex(lastIndex);
    };

    const primaryColor = useThemeColor({}, 'primary');
    const isLastSlide = currentIndex === onboardingData.length - 1;

    // Responsive styles
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        skipButton: {
            position: 'absolute',
            top: isTablet ? 80 : isSmallScreen ? 40 : 60,
            right: getResponsivePadding(),
            zIndex: 100,
            padding: 10,
        },
        footer: {
            position: 'absolute',
            bottom: isTablet ? 80 : isSmallScreen ? 30 : 50,
            left: 0,
            right: 0,
            paddingHorizontal: getResponsivePadding(),
        },
        skipText: {
            color: primaryColor,
            opacity: isLastSlide ? 0 : 1,
            fontSize: getResponsiveFontSize(16),
            fontWeight: '500' as const,
        },
    });

    return (
        <ThemedView style={styles.container}>
            {/* Skip Button */}
            <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkipToEnd}
                activeOpacity={0.7}
            >
                <ThemedText
                    type="subtitle"
                    style={styles.skipText}
                >
                    {t('onboarding.skip')}
                </ThemedText>
            </TouchableOpacity>

            {/* Onboarding Slides */}
            <FlatList
                data={onboardingData}
                renderItem={({ item }) => (
                    <View style={{ width }}>
                        <OnboardingItem item={item} screenWidth={width} screenHeight={height} />
                    </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                keyExtractor={(item) => item.id.toString()}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={32}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
            />

            {/* Footer with Paginator and Next Button */}
            <View style={styles.footer}>
                <Paginator
                    data={onboardingData}
                    scrollX={scrollX}
                    dotSize={isSmallScreen ? 6 : 8}
                    activeDotWidth={isSmallScreen ? 20 : 24}
                />

                <NextButton
                    title={t(onboardingData[currentIndex].action || 'onboarding.next')}
                    onPress={handleNext}
                    isLast={isLastSlide}
                    fontSize={getResponsiveFontSize(16)}
                    paddingVertical={isSmallScreen ? 14 : 16}
                />
            </View>
        </ThemedView>
    );
}
