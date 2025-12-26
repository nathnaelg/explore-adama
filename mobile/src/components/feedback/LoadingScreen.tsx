import { useThemeColor } from '@/src/hooks/use-theme-color';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';

interface LoadingScreenProps {
    message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
    const bg = useThemeColor({}, 'bg');
    const primary = useThemeColor({}, 'primary');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');

    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const pulse = Animated.sequence([
            Animated.timing(pulseAnim, {
                toValue: 1.1,
                duration: 1000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
        ]);

        Animated.loop(pulse).start();
    }, [pulseAnim]);

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <View style={styles.content}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Image
                        source={require('@/assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>

                <View style={styles.indicatorContainer}>
                    <View style={[styles.indicator, { backgroundColor: primary }]} />
                    <View style={[styles.indicator, { backgroundColor: primary, opacity: 0.6 }]} />
                    <View style={[styles.indicator, { backgroundColor: primary, opacity: 0.3 }]} />
                </View>

                {message && (
                    <Text style={[styles.message, { color: text }]}>{message}</Text>
                )}

                <Text style={[styles.tagline, { color: muted }]}>
                    Adama Smart Tourism
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 30,
    },
    indicatorContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    message: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 14,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    },
});
