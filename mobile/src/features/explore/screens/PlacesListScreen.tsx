import { OptimizedImage } from '@/src/components/common/OptimizedImage';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlaces } from '../hooks/useExplore';

export default function PlacesListScreen() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    // Get params
    const { categoryId, title } = useLocalSearchParams<{ categoryId: string; title: string }>();

    // Theme colors
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const accent = useThemeColor({}, 'accent');

    // Fetch places
    const { data: placesData, isLoading, refetch, isRefetching } = usePlaces({
        categoryId,
    });

    const places = placesData?.data || [];

    return (
        <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.backBtn, { backgroundColor: card }]}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={text} />
                </TouchableOpacity>
                <ThemedText type="subtitle" style={styles.headerTitle} numberOfLines={1}>
                    {title || t('explore.places', { defaultValue: 'Places' })}
                </ThemedText>
                <View style={{ width: 40 }} />
            </View>

            {/* Content */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={primary} />
                </View>
            ) : (
                <FlatList
                    data={places}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={primary} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="sad-outline" size={48} color={muted} style={{ marginBottom: 16 }} />
                            <ThemedText style={{ color: muted, textAlign: 'center' }}>
                                {t('common.noPlacesFound', { defaultValue: "No places found in this category" })}
                            </ThemedText>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.card, { backgroundColor: card }]}
                            onPress={() => router.push(`/place/${item.id}`)}
                        >
                            <OptimizedImage
                                source={{ uri: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' }}
                                style={styles.image}
                                contentFit="cover"
                                transition={300}
                            />
                            <View style={styles.content}>
                                <View style={styles.row}>
                                    <ThemedText style={[styles.title, { color: text }]} numberOfLines={1}>
                                        {item.name}
                                    </ThemedText>
                                    <View style={styles.ratingBadge}>
                                        <Ionicons name="star" size={12} color="#FFD700" />
                                        <ThemedText style={styles.ratingText}>
                                            {item.avgRating || 'New'}
                                        </ThemedText>
                                    </View>
                                </View>

                                <ThemedText style={[styles.address, { color: muted }]} numberOfLines={1}>
                                    <Ionicons name="location-outline" size={12} color={muted} /> {item.address || 'Adama, Ethiopia'}
                                </ThemedText>

                                <ThemedText style={[styles.description, { color: muted }]} numberOfLines={2}>
                                    {item.description}
                                </ThemedText>

                                <View style={styles.footer}>
                                    <View style={[styles.actionBtn, { borderColor: primary }]}>
                                        <ThemedText style={{ color: primary, fontSize: 12, fontWeight: '600' }}>
                                            {t('common.viewDetails', { defaultValue: "View Details" })}
                                        </ThemedText>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 20,
        gap: 20,
        paddingBottom: 40,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 180,
    },
    content: {
        padding: 16,
        gap: 6,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
        marginRight: 8,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#F9A825',
    },
    address: {
        fontSize: 13,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    actionBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
});
