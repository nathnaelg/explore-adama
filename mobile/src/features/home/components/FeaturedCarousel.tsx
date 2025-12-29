import { OptimizedImage } from '@/src/components/common/OptimizedImage';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

interface FeaturedCarouselProps {
    places: any[];
}

export function FeaturedCarousel({ places }: FeaturedCarouselProps) {
    const { t } = useTranslation();
    const primary = useThemeColor({}, 'primary');
    const muted = useThemeColor({}, 'muted');
    const [activeIndex, setActiveIndex] = useState(0);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        const index = Math.round(x / (CARD_WIDTH + 20));
        setActiveIndex(index);
    };

    if (!places || places.length === 0) return null;

    // Take top 5 for carousel
    const featuredPlaces = places.slice(0, 5);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="subtitle" style={styles.title}>{t('home.hiddenGems')}</ThemedText>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + 20}
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContent}
                onScroll={onScroll}
                scrollEventThrottle={16}
            >
                {featuredPlaces.map((place) => (
                    <TouchableOpacity
                        key={place.id}
                        activeOpacity={0.9}
                        style={[styles.card, { width: CARD_WIDTH }]}
                        onPress={() => router.push(`/place/${place.id}`)}
                    >
                        <OptimizedImage
                            source={{ uri: place.images?.[0]?.url || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' }}
                            style={styles.image}
                            contentFit="cover"
                        />
                        <View style={styles.overlay}>
                            <View style={[styles.ratingTag, { backgroundColor: primary }]}>
                                <Ionicons name="star" size={12} color="white" />
                                <ThemedText style={styles.ratingText}>{place.avgRating || t('explore.new')}</ThemedText>
                            </View>
                            <View style={styles.textContainer}>
                                <ThemedText style={styles.placeName} numberOfLines={1}>{place.name}</ThemedText>
                                <View style={styles.locationRow}>
                                    <Ionicons name="location" size={14} color="#E5E7EB" />
                                    <ThemedText style={styles.placeAddress} numberOfLines={1}>{place.address || t('home.adamaEthiopia')}</ThemedText>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {featuredPlaces.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            { backgroundColor: i === activeIndex ? primary : muted, width: i === activeIndex ? 20 : 8, opacity: i === activeIndex ? 1 : 0.5 }
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    card: {
        height: 220,
        borderRadius: 24,
        overflow: 'hidden',
        marginRight: 20, // Actually pagingEnabled expects full width, but we can do a trick or standard paging.
        // For standard paging with gap, logic is complex. Custom paging is better.
        // For simplicity with standard 'pagingEnabled', we often use full width items.
        // Let's remove marginRight and handle spacing via container padding on parent or specialized logic.
        // But to keep it simple: Standard Paging usually creates full screen swipes.
        // Let's disable pagingEnabled and use snapToInterval if we want "cards".
        // Re-writing scroll props below.
    },
    // Revised Card style will be applied in logic update.
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        justifyContent: 'flex-end',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.4)', // Gradient simulation
    },
    textContainer: {
        gap: 4,
    },
    placeName: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    placeAddress: {
        color: '#E5E7EB',
        fontSize: 14,
        fontWeight: '500',
    },
    ratingTag: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    ratingText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 12,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        gap: 6,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
});
