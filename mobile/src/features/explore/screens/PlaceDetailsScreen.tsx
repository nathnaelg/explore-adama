
import { OptimizedImage } from '@/src/components/common/OptimizedImage';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { PlaceDetailsSkeleton } from '@/src/features/explore/components/PlaceDetailsSkeleton';
import { usePlace } from '@/src/features/explore/hooks/useExplore';
import { useReviews } from '@/src/features/reviews/hooks/useReviews';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { FlashList as ShopifyFlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

const FlashList = ShopifyFlashList as any;

export default function PlaceDetailsScreen() {
    const { t } = useTranslation();
    const { placeId } = useLocalSearchParams<{ placeId: string }>();
    const { isAuthenticated, isGuest } = useAuth();
    const { data: place, isLoading: placeLoading, error: placeError } = usePlace(placeId || '');
    const { data: reviewsData, isLoading: reviewsLoading } = useReviews({
        itemType: 'PLACE',
        itemId: placeId || ''
    });



    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const chip = useThemeColor({}, 'chip');
    const error = useThemeColor({}, 'error');

    if (placeLoading) {
        return <PlaceDetailsSkeleton />;
    }

    if (placeError || !place) {
        return (
            <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Ionicons name="alert-circle-outline" size={60} color={error} />
                <ThemedText type="title" style={{ marginTop: 16 }}>{t('placeDetails.placeNotFound')}</ThemedText>
                <TouchableOpacity
                    style={[styles.bookButton, { marginTop: 20, backgroundColor: primary, paddingHorizontal: 30 }]}
                    onPress={() => router.back()}
                >
                    <ThemedText style={{ color: 'white' }}>{t('placeDetails.goBack')}</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    const reviews = reviewsData?.data || [];
    const gallery = place.images?.map((img, index) => ({ id: index.toString(), image: { uri: img.url } })) || [];

    const handleToggleFavorite = () => {
        if (isGuest) {
            router.push({
                pathname: '/(modals)/guest-prompt',
                params: {
                    title: t('placeDetails.signInRequired'),
                    message: t('placeDetails.saveFavoriteMsg'),
                    icon: 'bookmark-outline'
                }
            });
            return;
        }
        // toggleFavorite(placeId || ''); // This hook isn't imported here, but handle the UI logic for now
    };

    const handleBooking = () => {
        if (isGuest) {
            router.push({
                pathname: '/(modals)/guest-prompt',
                params: {
                    title: t('placeDetails.signInRequired'),
                    message: t('placeDetails.bookVisitMsg'),
                    icon: 'calendar-outline'
                }
            });
            return;
        }
        router.push({ pathname: '/bookings/new', params: { placeId: place.id } } as any);
    };

    const handleReview = () => {
        if (isGuest) {
            router.push({
                pathname: '/(modals)/guest-prompt',
                params: {
                    title: t('placeDetails.signInRequired'),
                    message: t('placeDetails.writeReviewMsg'),
                    icon: 'star-outline'
                }
            });
            return;
        }
        router.push({ pathname: '/reviews/add', params: { itemId: place.id, itemType: 'PLACE' } } as any);
    };

    const features = [
        { icon: 'wifi-outline', label: 'Free WiFi' },
        { icon: 'car-outline', label: 'Parking' },
        { icon: 'restaurant-outline', label: 'Food Court' },
    ];

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <OptimizedImage
                    source={{ uri: place.images?.[0]?.url || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' }}
                    style={styles.headerImage}
                    contentFit="cover"
                    transition={300}
                />

                {/* Header Buttons */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleToggleFavorite}>
                    <Ionicons name="bookmark-outline" size={24} color="white" />
                </TouchableOpacity>

                {/* Content */}
                <View style={[styles.content, { backgroundColor: bg }]}>
                    <View style={styles.placeHeader}>
                        <View style={{ flex: 1 }}>
                            <ThemedText type="title" style={styles.placeName}>{place.name}</ThemedText>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={16} color={primary} />
                                <ThemedText style={styles.rating}>
                                    {place.avgRating || 0} {t('placeDetails.reviewsCount', { count: reviews.length })}
                                </ThemedText>
                            </View>
                        </View>
                    </View>

                    {/* About */}
                    <View style={styles.section}>
                        <ThemedText type="subtitle" style={styles.sectionTitle}>{t('placeDetails.about')}</ThemedText>
                        <ThemedText style={[styles.description, { color: muted }]}>
                            {place.description || t('placeDetails.noDescription')}
                        </ThemedText>
                    </View>

                    {/* Location */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="location-outline" size={20} color={primary} />
                            <ThemedText type="subtitle" style={styles.sectionTitle}>{t('placeDetails.location')}</ThemedText>
                        </View>
                        <ThemedText style={styles.address}>{place.address || 'Adama, Ethiopia'}</ThemedText>
                    </View>

                    {/* Gallery */}
                    {gallery.length > 0 && (
                        <View style={styles.section}>
                            <ThemedText type="subtitle" style={styles.sectionTitle}>{t('placeDetails.gallery')}</ThemedText>
                            <FlashList
                                horizontal
                                data={gallery}
                                keyExtractor={(item: { id: string }) => item.id}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }: { item: { id: string; image: { uri: string } } }) => (
                                    <OptimizedImage source={item.image} style={styles.galleryImage} contentFit="cover" transition={300} />
                                )}
                                estimatedItemSize={162}
                                contentContainerStyle={{ paddingHorizontal: 0 }} // FlashList handles gap differently? No, maintain gap in contentContainerStyle or ItemSeparatorComponent.
                                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                            />
                        </View>
                    )}

                    {/* Reviews Summary */}
                    <View style={styles.section}>
                        <ThemedText type="subtitle" style={styles.sectionTitle}>{t('placeDetails.reviews')}</ThemedText>
                        {reviews.length === 0 ? (
                            <ThemedText style={{ color: muted }}>{t('placeDetails.noReviews')}</ThemedText>
                        ) : (
                            reviews.map((review) => (
                                <View key={review.id} style={[styles.reviewCard, { backgroundColor: card }]}>
                                    <View style={styles.reviewHeader}>
                                        <ThemedText style={styles.reviewerName}>
                                            {review.user?.profile?.name || review.user?.email || t('placeDetails.anonymous')}
                                        </ThemedText>
                                        <View style={[styles.reviewRating, { backgroundColor: chip }]}>
                                            <Ionicons name="star" size={14} color={primary} />
                                            <ThemedText style={{ fontWeight: 'bold', marginLeft: 4 }}>{review.rating}</ThemedText>
                                        </View>
                                    </View>
                                    <ThemedText style={[styles.reviewComment, { color: muted }]}>{review.comment}</ThemedText>
                                    <ThemedText style={styles.reviewTime}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </ThemedText>
                                </View>
                            ))
                        )}
                    </View>

                    {/* Actions */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.bookButton, { backgroundColor: primary }]}
                            onPress={handleBooking}
                        >
                            <ThemedText style={styles.bookButtonText}>{t('placeDetails.bookVisit')}</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.reviewButton, { borderColor: primary, borderWidth: 1 }]}
                            onPress={handleReview}
                        >
                            <ThemedText style={{ color: primary, fontWeight: 'bold' }}>{t('placeDetails.writeReview')}</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>


        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerImage: { width: '100%', height: 300 },
    backButton: {
        position: 'absolute', top: 60, left: 20, width: 40, height: 40,
        borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center', justifyContent: 'center'
    },
    saveButton: {
        position: 'absolute', top: 60, right: 20, width: 40, height: 40,
        borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center', justifyContent: 'center'
    },
    content: {
        padding: 24, borderTopLeftRadius: 30, borderTopRightRadius: 30,
        marginTop: -30, gap: 24
    },
    placeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    placeName: { fontSize: 26, fontWeight: 'bold' },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
    rating: { fontSize: 16, fontWeight: '500' },
    section: { gap: 12 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold' },
    description: { fontSize: 16, lineHeight: 24 },
    address: { fontSize: 16, fontWeight: '500' },
    galleryImage: { width: 150, height: 100, borderRadius: 12 },
    reviewCard: { padding: 16, borderRadius: 16, gap: 8, marginBottom: 12 },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    reviewerName: { fontWeight: 'bold', fontSize: 16 },
    reviewRating: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
    reviewComment: { fontSize: 14, lineHeight: 20 },
    reviewTime: { fontSize: 12, opacity: 0.6 },
    actionButtons: { flexDirection: 'row', gap: 12, paddingBottom: 40 },
    bookButton: { flex: 2, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    bookButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    reviewButton: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
});
