import { OptimizedImage } from '@/src/components/common/OptimizedImage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { ExploreSkeleton } from '@/src/features/explore/components/ExploreSkeleton';
import { useCategories, usePlaces } from '@/src/features/explore/hooks/useExplore';
import { useThemeColor } from '@/src/hooks/use-theme-color';

export default function ExploreScreen() {
    const { t } = useTranslation();
    /* ---------------- theme ---------------- */
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const accent = useThemeColor({}, 'accent');
    const chip = useThemeColor({}, 'chip');
    const insets = useSafeAreaInsets();

    /* ---------------- state ---------------- */
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    /* ---------------- data ---------------- */
    const { data: categories, isLoading: categoriesLoading } = useCategories();
    const { data: placesData, isLoading: placesLoading } = usePlaces({
        categoryId: selectedCategoryId || undefined,
        perPage: 20
    });

    const filters = [t('explore.distance'), t('explore.rating'), t('explore.price')];
    const places = placesData?.data || [];

    const displayCategories = categories ? [{ id: 'all', name: t('explore.all') }, ...categories] : [];

    if (placesLoading && !placesData) {
        return <ExploreSkeleton />;
    }

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* ================= Header ================= */}
                <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                    <ThemedText style={[styles.title, { color: text }]}>
                        {t('explore.exploreAdama')}
                    </ThemedText>

                    <TouchableOpacity
                        style={[styles.iconBtn, { backgroundColor: card }]}
                    >
                        <Ionicons name="search-outline" size={22} color={text} />
                    </TouchableOpacity>
                </View>

                {/* ================= Tabs ================= */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabs}
                >
                    {displayCategories.map((cat) => {
                        const active = (selectedCategoryId === null && cat.id === 'all') || selectedCategoryId === cat.id;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.tab,
                                    {
                                        backgroundColor: active ? primary : chip,
                                    },
                                ]}
                                onPress={() => setSelectedCategoryId(cat.id === 'all' ? null : cat.id)}
                            >
                                <ThemedText
                                    style={{
                                        color: active ? accent : text,
                                        fontWeight: '600',
                                    }}
                                >
                                    {cat.id === 'all' ? t('explore.all') : t(`explore.categories.${(cat as any).key || (cat as any).name.toLowerCase().replace(/[^a-z]/g, '')}`, { defaultValue: cat.name })}
                                </ThemedText>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* ================= Filters ================= */}
                <View style={styles.filters}>
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.filter, { backgroundColor: card }]}
                        >
                            <ThemedText style={{ color: text, fontSize: 14 }}>
                                {filter}
                            </ThemedText>
                            <Ionicons
                                name="chevron-down"
                                size={14}
                                color={muted}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ================= Cards ================= */}
                <View style={styles.list}>
                    {placesLoading ? (
                        <ExploreSkeleton />
                    ) : places.length === 0 ? (
                        <ThemedText style={{ color: muted, textAlign: 'center', marginTop: 50 }}>
                            {t('explore.noPlacesFound')}
                        </ThemedText>
                    ) : (
                        places.map((place) => (
                            <TouchableOpacity
                                key={place.id}
                                style={[styles.card, { backgroundColor: card }]}
                                onPress={() => router.push(`/place/${place.id}`)}
                            >
                                <OptimizedImage
                                    source={{ uri: place.images?.[0]?.url || 'https://images.unsplash.com/photo-1501117716987-c8e1ecb210d1' }}
                                    style={styles.imagePlaceholder}
                                    contentFit="cover"
                                    transition={300}
                                />
                                <View style={styles.ratingBadgeContainer}>
                                    <View
                                        style={[
                                            styles.ratingBadge,
                                            { backgroundColor: card },
                                        ]}
                                    >
                                        <Ionicons name="star" size={14} color={primary} />
                                        <ThemedText
                                            style={{ color: text, fontWeight: '700' }}
                                        >
                                            {place.avgRating || t('explore.new')}
                                        </ThemedText>
                                    </View>
                                </View>

                                {/* Card content */}
                                <View style={styles.cardBody}>
                                    <ThemedText
                                        style={[styles.cardTitle, { color: text }]}
                                    >
                                        {place.name}
                                    </ThemedText>

                                    <ThemedText
                                        style={[styles.cardSubtitle, { color: muted }]}
                                    >
                                        {place.address || t('home.adamaEthiopia')}
                                    </ThemedText>

                                    {place.viewCount !== undefined && (
                                        <ThemedText style={{ color: muted, fontSize: 13 }}>
                                            {t('explore.views', { count: place.viewCount })}
                                        </ThemedText>
                                    )}

                                    <TouchableOpacity
                                        style={[
                                            styles.viewBtn,
                                            { backgroundColor: primary },
                                        ]}
                                        onPress={() => router.push(`/place/${place.id}`)}
                                    >
                                        <ThemedText
                                            style={{ color: accent, fontWeight: '700' }}
                                        >
                                            {t('common.view')}
                                        </ThemedText>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>
        </ThemedView>
    );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        paddingHorizontal: 20,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        fontSize: 25,
        fontWeight: '700',
    },

    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    tabs: {
        paddingHorizontal: 20,
        gap: 10,
        marginTop: 20,
    },

    tab: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
    },

    filters: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 10,
        marginVertical: 16,
    },

    filter: {
        flexDirection: 'row',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
        alignItems: 'center',
    },

    list: {
        paddingHorizontal: 20,
        gap: 20,
        paddingBottom: 40,
    },

    card: {
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 4,
    },

    imagePlaceholder: {
        height: 170,
        backgroundColor: '#E5E7EB',
    },

    ratingBadgeContainer: {
        position: 'absolute',
        right: 12,
        top: 12,
    },
    ratingBadge: {
        flexDirection: 'row',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },

    cardBody: {
        padding: 16,
        gap: 6,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
    },

    cardSubtitle: {
        fontSize: 14,
    },

    row: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },

    openBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 6,
    },

    viewBtn: {
        alignSelf: 'flex-end',
        paddingHorizontal: 22,
        paddingVertical: 10,
        borderRadius: 18,
        marginTop: 10,
    },
});
