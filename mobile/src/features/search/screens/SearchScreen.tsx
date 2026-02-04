
import { HighlightText } from '@/src/components/common/HighlightText';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { useCategories } from '@/src/features/explore/hooks/useExplore';
import { RichResultCard } from '@/src/features/search/components/RichResultCard';
import { SearchSkeleton } from '@/src/features/search/components/SearchSkeleton';
import { SearchSuggestions } from '@/src/features/search/components/SearchSuggestions';
import { useDebouncedSearchWithType } from '@/src/features/search/hooks/useSearch';
import { searchHistoryService } from '@/src/features/search/services/searchHistory.service';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { FlashList as ShopifyFlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Keyboard,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
const FlashList = ShopifyFlashList as any;

export default function SearchScreen() {
    const { t } = useTranslation();
    const { q, type } = useLocalSearchParams<{ q: string; type: 'all' | 'place' | 'event' | 'blog' }>();
    const [query, setQuery] = useState(q || '');

    // State for search type (Tab)
    const [searchType, setSearchType] = useState<'all' | 'place' | 'event' | 'blog'>(type || 'all');

    // Update when params change
    useEffect(() => {
        if (type) setSearchType(type);
    }, [type]);

    const tabs = [
        { id: 'all', label: t('search.tabs.all', { defaultValue: 'All' }) },
        { id: 'blog', label: t('search.tabs.posts', { defaultValue: 'Posts' }) },
        { id: 'place', label: t('search.tabs.places', { defaultValue: 'Places' }) },
        { id: 'event', label: t('search.tabs.events', { defaultValue: 'Events' }) },
    ] as const;

    // Use the new hook with type filtering
    const {
        debouncedQuery,
        data: searchResults,
        isLoading,
        isError,
        error,
        smartSearchData
    } = useDebouncedSearchWithType(
        query,
        searchType,
        500
    );
    const { isAuthenticated } = useAuth();
    const { data: categoriesData } = useCategories();
    const categories = categoriesData || [];

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const chip = useThemeColor({}, 'chip');
    const tint = useThemeColor({}, 'tint');

    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    // Navigation guard to prevent double navigation
    const hasNavigatedRef = React.useRef(false);

    // Reset navigation guard when query changes
    useEffect(() => {
        hasNavigatedRef.current = false;
    }, [debouncedQuery]);

    // Handle Smart Search Intent (Auto-Navigate)
    useEffect(() => {
        if (!isLoading && smartSearchData && searchType === 'blog' && !hasNavigatedRef.current) {
            if (smartSearchData.intent === 'navigate' && smartSearchData.bestMatch) {
                console.log('[SearchScreen] Auto-navigating to blog:', smartSearchData.bestMatch.title);
                hasNavigatedRef.current = true;
                router.push(`/blog/${smartSearchData.bestMatch.id}`);
            }
        }
    }, [smartSearchData, isLoading, searchType]);

    // Load recent searches on mount
    useEffect(() => {
        searchHistoryService.getRecentSearches().then(setRecentSearches);
    }, []);

    // Save search when user searches
    useEffect(() => {
        if (debouncedQuery && debouncedQuery.length > 0) {
            searchHistoryService.addSearch(debouncedQuery);
            searchHistoryService.getRecentSearches().then(setRecentSearches);
        }
    }, [debouncedQuery]);

    useEffect(() => {
        if (q) {
            setQuery(q);
        }
    }, [q]);

    const handleClearRecent = async () => {
        await searchHistoryService.clearRecentSearches();
        setRecentSearches([]);
    };

    const handleSelectSuggestion = (suggestion: string) => {
        setQuery(suggestion);
    };

    // Popular searches based on search type
    const getPopularSearches = () => {
        if (searchType === 'blog') {
            return ['travel tips', 'culture', 'food', 'adventure', 'hotels'];
        }
        return ['hotels', 'restaurants', 'attractions', 'events', 'spa'];
    };

    const handleResultPress = (result: any) => {
        if (result.type === 'place') {
            router.push(`/place/${result.id}`);
        } else if (result.type === 'event') {
            if (!isAuthenticated) {
                router.push('/(auth)/login');
                return;
            }
            router.push({ pathname: '/bookings/new', params: { eventId: result.id } } as any);
        } else if (result.type === 'blog') {
            // Check intent from smart search if available
            if (smartSearchData?.intent === 'navigate' && smartSearchData.bestMatch?.id === result.id) {
                // Already handled? 
            }
            router.push(`/blog/${result.id}`);
        }
    };

    const renderResultItem = ({ item }: { item: any }) => {
        if (item.type === 'blog') {
            return (
                <RichResultCard
                    post={item.data}
                    searchQuery={debouncedQuery}
                    onPress={() => handleResultPress(item)}
                />
            );
        }

        // Default card for Places/Events
        return (
            <TouchableOpacity
                style={[styles.resultCard, { backgroundColor: card }]}
                onPress={() => handleResultPress(item)}
            >
                <View style={styles.resultHeader}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <HighlightText
                                text={item.name}
                                term={debouncedQuery}
                                style={[styles.resultName, { color: text }]}
                            />
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
                    <HighlightText
                        text={item.description}
                        term={debouncedQuery}
                        style={[styles.resultDescription, { color: muted }]}
                        numberOfLines={2}
                    />
                )}

                <View style={styles.resultDetails}>
                    {item.address && (
                        <View style={styles.detailItem}>
                            <Ionicons name="location-outline" size={14} color={muted} />
                            <HighlightText
                                text={item.address}
                                term={debouncedQuery}
                                style={[styles.detailText, { color: muted }]}
                                numberOfLines={1}
                            />
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
    };

    return (
        <ThemedView style={styles.container}>
            {/* Search Header */}
            <View style={[styles.searchHeader, { backgroundColor: card, paddingBottom: 0 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <View style={[styles.searchContainer, { backgroundColor: bg, flex: 1 }]}>
                        <Ionicons name="search" size={20} color={muted} />
                        <TextInput
                            style={[styles.searchInput, { color: text }]}
                            placeholder={t('search.placeholder')}
                            placeholderTextColor={muted}
                            value={query}
                            onChangeText={setQuery}
                            autoFocus
                            returnKeyType="search"
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />
                        {isLoading && (
                            <ActivityIndicator size="small" color={primary} style={{ marginRight: 5 }} />
                        )}
                        {!isLoading && query.length > 0 && (
                            <TouchableOpacity onPress={() => setQuery('')}>
                                <Ionicons name="close-circle" size={20} color={muted} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity onPress={() => router.back()}>
                        <ThemedText style={{ color: primary, fontWeight: '600' }}>{t('common.cancel')}</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
                >
                    {tabs.map(tab => (
                        <TouchableOpacity
                            key={tab.id}
                            style={[
                                styles.tab,
                                {
                                    backgroundColor: searchType === tab.id ? primary : chip,
                                    borderWidth: 1,
                                    borderColor: searchType === tab.id ? primary : 'transparent'
                                }
                            ]}
                            onPress={() => setSearchType(tab.id)}
                        >
                            <ThemedText style={{
                                color: searchType === tab.id ? 'white' : text,
                                fontWeight: searchType === tab.id ? '600' : '400',
                                fontSize: 13
                            }}>
                                {tab.label}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlashList
                data={query.length > 0 && !isLoading && debouncedQuery === query ? searchResults : []}
                renderItem={renderResultItem}
                estimatedItemSize={120}
                keyExtractor={(item: any) => `${item.type}-${item.id}`}
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ paddingBottom: 40, backgroundColor: bg }}
                ListHeaderComponent={
                    <>
                        {query.length === 0 ? (
                            <>
                                {/* Search Suggestions */}
                                <SearchSuggestions
                                    recentSearches={recentSearches}
                                    popularSearches={getPopularSearches()}
                                    onSelectSuggestion={handleSelectSuggestion}
                                    onClearRecent={handleClearRecent}
                                    searchType={searchType}
                                />

                                {/* Popular Categories */}
                                <View style={styles.section}>
                                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: text }]}>
                                        {t('search.browseByCategory')}
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
                                                <ThemedText style={styles.categoryName} numberOfLines={1}>
                                                    {category.name}
                                                </ThemedText>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {/* Search Tips */}
                                <View style={styles.section}>
                                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: text }]}>
                                        {t('search.searchTips')}
                                    </ThemedText>
                                    <View style={{ gap: 12 }}>
                                        <View style={styles.tipItem}>
                                            <Ionicons name="search-outline" size={20} color={primary} />
                                            <ThemedText style={{ color: muted, flex: 1 }}>
                                                {t('search.tipHotels')}
                                            </ThemedText>
                                        </View>
                                        <View style={styles.tipItem}>
                                            <Ionicons name="location-outline" size={20} color={primary} />
                                            <ThemedText style={{ color: muted, flex: 1 }}>
                                                {t('search.tipLocation')}
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

                                {/* Error State */}
                                {!isLoading && isError ? (
                                    <View style={{ padding: 20, alignItems: 'center', marginTop: 20 }}>
                                        <Ionicons name="cloud-offline-outline" size={48} color={primary} />
                                        <ThemedText style={{ color: text, marginTop: 10, textAlign: 'center', fontWeight: 'bold' }}>
                                            {t('common.networkError', { defaultValue: 'Connection Failed' })}
                                        </ThemedText>
                                        <ThemedText style={{ color: muted, marginTop: 5, textAlign: 'center' }}>
                                            {(error as Error)?.message || 'Please check your internet connection'}
                                        </ThemedText>
                                        <TouchableOpacity
                                            style={{ marginTop: 15, padding: 10, backgroundColor: card, borderRadius: 8 }}
                                            onPress={() => setQuery(query + ' ')} // Trick to re-trigger search
                                        >
                                            <ThemedText style={{ color: primary }}>{t('common.retry', { defaultValue: 'Retry' })}</ThemedText>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    /* Search Results Header */
                                    !isLoading && debouncedQuery === query && searchResults && searchResults.length > 0 && (
                                        <View style={[styles.section, { paddingBottom: 0 }]}>
                                            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: text }]}>
                                                {t('search.resultsCount', { count: searchResults.length })}
                                            </ThemedText>
                                        </View>
                                    )
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
                                {t('search.noResults', { query })}
                            </ThemedText>
                            <ThemedText style={{ color: muted, textAlign: 'center', marginTop: 8 }}>
                                {t('search.tryDifferent')}
                            </ThemedText>
                        </View>
                    ) : null
                }
            />


        </ThemedView >
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
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    detailText: {
        fontSize: 12
    },
    noResultsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60
    },
    noResultsText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16
    }
});
