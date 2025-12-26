
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { useCategories } from '@/src/features/explore/hooks/useExplore';
import { SearchSkeleton } from '@/src/features/search/components/SearchSkeleton';
import { useDebouncedSearch } from '@/src/features/search/hooks/useSearch';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { FlashList as ShopifyFlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
const FlashList = ShopifyFlashList as any;

export default function SearchScreen() {
    const { query, setQuery, debouncedQuery, data: searchResults, isLoading } = useDebouncedSearch('', 500);
    const { isGuest } = useAuth();
    const { data: categoriesData } = useCategories();
    const categories = categoriesData || [];

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const chip = useThemeColor({}, 'chip');
    const tint = useThemeColor({}, 'tint');

    const handleResultPress = (result: any) => {
        if (result.type === 'place') {
            router.push(`/place/${result.id}`);
        } else if (result.type === 'event') {
            if (isGuest) {
                router.push({
                    pathname: '/(modals)/guest-prompt',
                    params: {
                        title: 'Sign In Required',
                        message: 'Please sign in to book tickets or tours found in your search.',
                        icon: 'search-outline'
                    }
                });
                return;
            }
            router.push({ pathname: '/bookings/new', params: { eventId: result.id } } as any);
        } else if (result.type === 'blog') {
            router.push(`/blog/${result.id}`);
        }
    };

    const renderResultItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.resultCard, { backgroundColor: card }]}
            onPress={() => handleResultPress(item)}
        >
            <View style={styles.resultHeader}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <ThemedText type="title" style={[styles.resultName, { color: text }]}>
                            {item.name}
                        </ThemedText>
                        <View style={[styles.typeBadge, { backgroundColor: chip }]}>
                            <ThemedText style={{ fontSize: 10, color: primary, fontWeight: '600' }}>
                                {item.type.toUpperCase()}
                            </ThemedText>
                        </View>
                    </View>
                </View>
                {item.rating && (
                    <View style={[styles.ratingBadge, { backgroundColor: 'rgba(150,150,150,0.1)' }]}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <ThemedText type="default" style={[styles.ratingText, { color: text }]}>
                            {item.rating.toFixed(1)}
                        </ThemedText>
                    </View>
                )}
            </View>

            {item.description && (
                <ThemedText type="default" style={[styles.resultDescription, { color: muted }]} numberOfLines={2}>
                    {item.description}
                </ThemedText>
            )}

            <View style={styles.resultDetails}>
                {item.address && (
                    <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={14} color={muted} />
                        <ThemedText type="default" style={[styles.detailText, { color: muted }]} numberOfLines={1}>
                            {item.address}
                        </ThemedText>
                    </View>
                )}
                {item.time && (
                    <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={14} color={muted} />
                        <ThemedText type="default" style={[styles.detailText, { color: muted }]}>
                            {new Date(item.time).toLocaleDateString()}
                        </ThemedText>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <ThemedView style={styles.container}>
            {/* Search Header */}
            <View style={[styles.searchHeader, { backgroundColor: card }]}>
                <View style={[styles.searchContainer, { backgroundColor: bg }]}>
                    <Ionicons name="search" size={20} color={muted} />
                    <TextInput
                        style={[styles.searchInput, { color: text }]}
                        placeholder="Search places, events, blogs..."
                        placeholderTextColor={muted}
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <Ionicons name="close-circle" size={20} color={muted} />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity onPress={() => router.back()}>
                    <ThemedText type="link" style={{ color: primary }}>Cancel</ThemedText>
                </TouchableOpacity>
            </View>

            <FlashList
                data={query.length > 0 && !isLoading && debouncedQuery === query ? searchResults : []}
                renderItem={({ item }: { item: any }) => (
                    <View style={{ paddingHorizontal: 20 }}>
                        {renderResultItem({ item })}
                    </View>
                )}
                estimatedItemSize={120}
                keyExtractor={(item: any) => `${item.type}-${item.id}`}
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ paddingBottom: 40, backgroundColor: bg }}
                ListHeaderComponent={
                    <>
                        {query.length === 0 ? (
                            <>
                                {/* Popular Categories */}
                                <View style={styles.section}>
                                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: text }]}>
                                        Browse by Category
                                    </ThemedText>
                                    <View style={styles.categoriesGrid}>
                                        {categories.slice(0, 6).map((category: any) => (
                                            <TouchableOpacity
                                                key={category.id}
                                                style={[styles.categoryCard, { backgroundColor: card }]}
                                                onPress={() => router.push(`/(tabs)/explore?category=${category.id}`)}
                                            >
                                                <View style={[styles.categoryIcon, { backgroundColor: chip }]}>
                                                    <Ionicons name="location" size={24} color={primary} />
                                                </View>
                                                <ThemedText type="default" style={[styles.categoryName, { color: text }]} numberOfLines={1}>
                                                    {category.name}
                                                </ThemedText>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {/* Search Tips */}
                                <View style={styles.section}>
                                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: text }]}>
                                        Search Tips
                                    </ThemedText>
                                    <View style={{ gap: 12 }}>
                                        <View style={styles.tipItem}>
                                            <Ionicons name="search-outline" size={20} color={primary} />
                                            <ThemedText style={{ color: muted, flex: 1 }}>
                                                Try searching for &quot;hotels&quot;, &quot;restaurants&quot;, or &quot;events&quot;
                                            </ThemedText>
                                        </View>
                                        <View style={styles.tipItem}>
                                            <Ionicons name="location-outline" size={20} color={primary} />
                                            <ThemedText style={{ color: muted, flex: 1 }}>
                                                Search by location or neighborhood
                                            </ThemedText>
                                        </View>
                                    </View>
                                </View>
                            </>
                        ) : (
                            <>
                                {/* Loading State */}
                                {isLoading && debouncedQuery === query && (
                                    <SearchSkeleton />
                                )}

                                {/* Search Results Header */}
                                {!isLoading && debouncedQuery === query && searchResults && searchResults.length > 0 && (
                                    <View style={[styles.section, { paddingBottom: 0 }]}>
                                        <ThemedText type="subtitle" style={[styles.sectionTitle, { color: text }]}>
                                            Found {searchResults.length} results
                                        </ThemedText>
                                    </View>
                                )}
                            </>
                        )}
                    </>
                }
                ListEmptyComponent={
                    query.length > 0 && !isLoading && debouncedQuery === query && (!searchResults || searchResults.length === 0) ? (
                        <View style={styles.noResultsContainer}>
                            <Ionicons name="search-outline" size={64} color={muted} />
                            <ThemedText type="default" style={[styles.noResultsText, { color: muted }]}>
                                No results found for &quot;{query}&quot;
                            </ThemedText>
                            <ThemedText style={{ color: muted, textAlign: 'center', marginTop: 8 }}>
                                Try different keywords or browse categories
                            </ThemedText>
                        </View>
                    ) : null
                }
            />


        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    searchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        gap: 12,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    searchInput: { flex: 1, fontSize: 16 },
    section: { paddingHorizontal: 20, paddingVertical: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    categoryCard: {
        width: '30%',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    categoryName: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
    tipItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    resultCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    resultName: { fontSize: 16, fontWeight: 'bold' },
    typeBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 2,
    },
    ratingText: { fontSize: 12, fontWeight: '600' },
    resultDescription: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
    resultDetails: { flexDirection: 'row', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4, maxWidth: '45%' },
    detailText: { fontSize: 12 },
    noResultsContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    noResultsText: { fontSize: 16, marginTop: 16, textAlign: 'center' },
});
