import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { ReviewListSkeleton } from '@/src/features/reviews/components/ReviewListSkeleton';
import { useReviews } from '@/src/features/reviews/hooks/useReviews';
import { Review } from '@/src/features/reviews/types';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { FlashList as ShopifyFlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
const FlashList = ShopifyFlashList as any;

export default function ReviewListScreen() {
    const { itemId, itemType } = useLocalSearchParams<{ itemId: string, itemType: string }>();
    const { data: reviewsData, isLoading, error } = useReviews({
        itemId: itemId || '',
        itemType: itemType as any || 'PLACE'
    });

    const reviews = reviewsData?.data || [];
    const primary = useThemeColor({}, 'primary');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const card = useThemeColor({}, 'card');

    if (isLoading) {
        return <ReviewListSkeleton />;
    }

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <ThemedView style={styles.container}>
            <FlashList
                data={reviews}
                estimatedItemSize={150}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={text} /></TouchableOpacity>
                            <ThemedText type="title">Reviews</ThemedText>
                            <View style={{ width: 24 }} />
                        </View>

                        <View style={styles.ratingSummary}>
                            <ThemedText style={styles.ratingLarge}>{averageRating}</ThemedText>
                            <View style={styles.ratingDetails}>
                                <View style={styles.stars}>
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Ionicons key={s} name="star" size={20} color={s <= parseFloat(averageRating) ? '#FFD700' : muted} />
                                    ))}
                                </View>
                                <ThemedText style={{ color: muted }}>Based on {reviews.length} reviews</ThemedText>
                            </View>
                        </View>
                    </>
                }
                renderItem={({ item }: { item: Review }) => (
                    <View style={[styles.reviewCard, { backgroundColor: card }]}>
                        <View style={styles.reviewHeader}>
                            <View style={styles.userInfo}>
                                <View style={[styles.avatar, { backgroundColor: primary }]}>
                                    <ThemedText style={{ color: 'white' }}>{item.user?.profile?.name?.[0] || 'U'}</ThemedText>
                                </View>
                                <View>
                                    <ThemedText style={styles.userName}>{item.user?.profile?.name || 'Anonymous'}</ThemedText>
                                    <ThemedText style={[styles.time, { color: muted }]}>{new Date(item.createdAt).toLocaleDateString()}</ThemedText>
                                </View>
                            </View>
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={14} color="#FFD700" />
                                <ThemedText style={{ fontWeight: 'bold' }}>{item.rating}</ThemedText>
                            </View>
                        </View>
                        <ThemedText style={[styles.comment, { color: text }]}>{item.comment}</ThemedText>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', padding: 40 }}>
                        <Ionicons name="chatbubble-outline" size={48} color={muted} />
                        <ThemedText style={{ color: muted, marginTop: 16 }}>No reviews yet</ThemedText>
                    </View>
                }
                ListFooterComponent={
                    <TouchableOpacity
                        style={[styles.writeButton, { backgroundColor: primary }]}
                        onPress={() => router.push({ pathname: '/reviews/add', params: { itemId, itemType } } as any)}
                    >
                        <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Write a Review</ThemedText>
                    </TouchableOpacity>
                }
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
    ratingSummary: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 20 },
    ratingLarge: { fontSize: 48, fontWeight: 'bold' },
    ratingDetails: { gap: 4 },
    stars: { flexDirection: 'row', gap: 2 },
    reviewCard: { marginHorizontal: 20, marginBottom: 16, padding: 16, borderRadius: 12 },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    userName: { fontWeight: 'bold', fontSize: 16 },
    time: { fontSize: 12 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(150,150,150,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    comment: { fontSize: 14, lineHeight: 20 },
    writeButton: { marginHorizontal: 20, marginVertical: 20, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
});
