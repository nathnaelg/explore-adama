import { OptimizedImage } from '@/src/components/common/OptimizedImage';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { SavedPlacesSkeleton } from '@/src/features/profile/components/SavedPlacesSkeleton';
import { useFavorites, useToggleFavorite } from '@/src/features/profile/hooks/useFavorites';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { FlashList as ShopifyFlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const FlashList = ShopifyFlashList as any;

export default function SavedPlacesScreen() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const insets = useSafeAreaInsets();

    // Theme hooks
    const primary = useThemeColor({}, 'primary');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const card = useThemeColor({}, 'card');
    const bg = useThemeColor({}, 'bg');
    const chip = useThemeColor({}, 'chip');
    const error = useThemeColor({}, 'error');

    const { data: favorites, isLoading, refetch } = useFavorites();
    const { mutate: toggleFavorite } = useToggleFavorite();

    const categories = [
        { id: 'all', label: 'All', icon: 'grid-outline' },
        { id: 'PLACE', label: 'Places', icon: 'location-outline' },
        { id: 'EVENT', label: 'Events', icon: 'calendar-outline' },
    ];

    const savedPlaces = favorites || [];

    const filteredPlaces = selectedCategory === 'all'
        ? savedPlaces
        : savedPlaces.filter(place => place.itemType === selectedCategory);

    const handleUnsave = (id: string, type: 'PLACE' | 'EVENT') => {
        toggleFavorite({ itemId: id, itemType: type, isFavorite: true });
    };

    const renderPlaceCard = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.placeCard, { backgroundColor: card }]}
            onPress={() => router.push(item.itemType === 'EVENT' ? `/booking/${item.itemId}` : `/place/${item.itemId}`)}
        >
            <OptimizedImage
                source={{ uri: item.image || 'https://images.unsplash.com/photo-1501117716987-c8e1ecb210d1' }}
                style={styles.placeImage}
            />

            <View style={styles.placeContent}>
                <View style={styles.placeHeader}>
                    <View style={styles.placeInfo}>
                        <ThemedText type="title" style={styles.placeName}>
                            {item.name || 'Unknown Place'}
                        </ThemedText>
                        <ThemedText type="default" style={[styles.placeType, { color: muted }]}>
                            {item.itemType === 'EVENT' ? 'Event' : 'Place'}
                        </ThemedText>
                    </View>
                    <TouchableOpacity
                        style={styles.unsaveButton}
                        onPress={() => handleUnsave(item.itemId, item.itemType)}
                    >
                        <Ionicons name="heart" size={24} color={error} />
                    </TouchableOpacity>
                </View>

                {/* Note: Backend might not return full details like rating/price in the favorites list directly 
                    unless populated. Displaying what's available. */}

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={[styles.bookButton, { backgroundColor: primary }]}>
                        <ThemedText type="default" style={styles.bookButtonText}>
                            View Details
                        </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.shareButton, { backgroundColor: primary + '15', borderColor: primary }]}>
                        <Ionicons name="share-outline" size={20} color={primary} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ThemedView style={styles.container}>
            <View style={[
                styles.header,
                { paddingTop: insets.top + 10 }
            ]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#666" />
                </TouchableOpacity>
                <ThemedText type="title" style={styles.title}>
                    Saved Places
                </ThemedText>
                <View style={{ width: 24 }} />
            </View>

            <FlashList
                data={filteredPlaces}
                renderItem={({ item }: { item: any }) => (
                    <View style={{ paddingHorizontal: 20 }}>
                        {renderPlaceCard({ item })}
                    </View>
                )}
                estimatedItemSize={300}
                keyExtractor={(item: any) => item.id}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                }
                contentContainerStyle={{ paddingBottom: 40 }}
                ListHeaderComponent={
                    <>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoriesContainer}
                            contentContainerStyle={styles.categoriesContent}
                        >
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        styles.categoryButton,
                                        { backgroundColor: chip },
                                        selectedCategory === category.id && { backgroundColor: primary },
                                    ]}
                                    onPress={() => setSelectedCategory(category.id)}
                                >
                                    <Ionicons
                                        name={category.icon as any}
                                        size={20}
                                        color={selectedCategory === category.id ? 'white' : muted}
                                    />
                                    <ThemedText
                                        type="default"
                                        style={[
                                            styles.categoryText,
                                            { color: muted },
                                            selectedCategory === category.id && { color: 'white' },
                                        ]}
                                    >
                                        {category.label}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Ionicons name="bookmark" size={24} color="#007AFF" />
                                <View style={styles.statTexts}>
                                    <ThemedText type="title" style={styles.statNumber}>
                                        {savedPlaces.length}
                                    </ThemedText>
                                    <ThemedText type="default" style={styles.statLabel}>
                                        Total Saved
                                    </ThemedText>
                                </View>
                            </View>
                        </View>
                        {isLoading && <SavedPlacesSkeleton />}
                    </>
                }
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="bookmark-outline" size={80} color={muted + '50'} />
                            <ThemedText type="title" style={[styles.emptyTitle, { color: text }]}>
                                No saved places
                            </ThemedText>
                            <ThemedText type="default" style={[styles.emptyDescription, { color: muted }]}>
                                Save places you like by tapping the heart icon
                            </ThemedText>
                            <TouchableOpacity
                                style={[styles.exploreButton, { backgroundColor: primary }]}
                                onPress={() => router.push('/(tabs)/explore')}
                            >
                                <ThemedText type="default" style={styles.exploreButtonText}>
                                    Start Exploring
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    ) : null
                }
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    categoriesContainer: {
        marginBottom: 24,
        marginTop: 16,
    },
    categoriesContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        gap: 8,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 24,
        marginBottom: 24,
        borderRadius: 12,
        marginHorizontal: 20,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statTexts: {
        alignItems: 'flex-start',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 12,
    },
    placesList: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    placeCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    placeImage: {
        width: '100%',
        height: 200,
    },
    placeContent: {
        padding: 20,
    },
    placeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    placeInfo: {
        flex: 1,
    },
    placeName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    placeType: {
        fontSize: 14,
    },
    unsaveButton: {
        padding: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    bookButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    bookButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    shareButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    emptyState: {
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 80,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyDescription: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    exploreButton: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    exploreButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
