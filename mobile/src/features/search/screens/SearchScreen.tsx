import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OptimizedImage } from '@/src/components/common/OptimizedImage';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { useDebounce } from '@/src/hooks/useDebounce';
import { SearchResults, searchService } from '../services/search.service';

type Tab = 'all' | 'places' | 'events' | 'people' | 'blogs';

export default function SearchScreen() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    // Theme colors
    const bg = useThemeColor({}, 'bg');
    const cardColor = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const accent = useThemeColor({}, 'accent');
    const chip = useThemeColor({}, 'chip');
    const border = useThemeColor({}, 'border');
    const inputBg = useThemeColor({}, 'chip'); // Use chip color for input background

    // State
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(false);

    const debouncedQuery = useDebounce(query, 500);

    /* ---------------- Side Effects ---------------- */
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults(null);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const data = await searchService.search(debouncedQuery);
                setResults(data);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    /* ---------------- Helpers ---------------- */
    const hasResults = results && (
        results.places.length > 0 ||
        results.events.length > 0 ||
        results.users.length > 0 ||
        results.blogPosts.length > 0
    );

    /* ---------------- Renderers ---------------- */
    const renderSectionHeader = (title: string, seeAllTab: Tab) => (
        <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: text }]}>{title}</ThemedText>
            {activeTab === 'all' && (
                <TouchableOpacity onPress={() => setActiveTab(seeAllTab)}>
                    <ThemedText style={{ color: primary, fontSize: 13, fontWeight: '600' }}>{t('common.seeAll', { defaultValue: 'See All' })}</ThemedText>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderPlaceItem = (place: any) => (
        <TouchableOpacity
            key={place.id}
            style={[styles.resultItem, { backgroundColor: cardColor }]}
            onPress={() => router.push(`/place/${place.id}`)}
        >
            <OptimizedImage
                source={{ uri: place.images?.[0]?.url || 'https://via.placeholder.com/150' }}
                style={styles.resultImage}
                contentFit="cover"
            />
            <View style={styles.resultContent}>
                <ThemedText style={[styles.resultTitle, { color: text }]} numberOfLines={1}>{place.name}</ThemedText>
                <ThemedText style={{ color: muted, fontSize: 12, marginBottom: 4 }} numberOfLines={1}>{place.address || 'Adama, Ethiopia'}</ThemedText>

                <View style={[styles.miniBadge, { backgroundColor: bg }]}>
                    <Ionicons name="location-sharp" size={10} color={primary} />
                    <ThemedText style={{ color: text, fontSize: 10, fontWeight: '600' }}>Place</ThemedText>
                </View>
            </View>
            <View style={{ justifyContent: 'center', paddingRight: 10 }}>
                <Ionicons name="chevron-forward" size={16} color={muted} />
            </View>
        </TouchableOpacity>
    );

    const renderEventItem = (event: any) => {
        const eventDate = new Date(event.date);
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const isPast = eventDate < startOfToday;
        return (
            <TouchableOpacity
                key={event.id}
                style={[styles.resultItem, { backgroundColor: cardColor, opacity: isPast ? 0.7 : 1 }]}
                onPress={() => router.push({ pathname: '/bookings/new', params: { eventId: event.id } } as any)}
            >
                {/* Use Calendar icon placeholder if no image */}
                {event.images?.[0]?.url ? (
                    <OptimizedImage
                        source={{ uri: event.images[0].url }}
                        style={styles.resultImage}
                        contentFit="cover"
                    />
                ) : (
                    <View style={[styles.resultImage, { backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }]}>
                        <Ionicons name="calendar" size={24} color={primary} />
                    </View>
                )}

                <View style={styles.resultContent}>
                    <ThemedText style={[styles.resultTitle, { color: text }]} numberOfLines={1}>{event.title}</ThemedText>
                    <ThemedText style={{ color: isPast ? muted : primary, fontSize: 12, fontWeight: '500', marginBottom: 4 }}>
                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        {isPast && " (Passed)"}
                    </ThemedText>
                    <View style={[styles.miniBadge, { backgroundColor: isPast ? muted + '20' : bg }]}>
                        <Ionicons name={isPast ? "time" : "ticket"} size={10} color={isPast ? muted : accent} />
                        <ThemedText style={{ color: isPast ? muted : text, fontSize: 10, fontWeight: '600' }}>
                            {isPast ? "Past Event" : "Event"}
                        </ThemedText>
                    </View>
                </View>
                <View style={{ justifyContent: 'center', paddingRight: 10 }}>
                    <Ionicons name="chevron-forward" size={16} color={muted} />
                </View>
            </TouchableOpacity>
        );
    };

    const renderUserItem = (user: any) => (
        <TouchableOpacity
            key={user.id}
            style={[styles.userItem]}
        // onPress={() => router.push(`/profile/${user.id}`)} // Assuming profile route
        >
            <OptimizedImage
                source={{ uri: user.profile?.avatar || 'https://ui-avatars.com/api/?name=User' }}
                style={styles.userAvatar}
                contentFit="cover"
            />
            <ThemedText style={{ color: text, fontSize: 12, fontWeight: '600', marginTop: 4, textAlign: 'center' }} numberOfLines={1}>
                {user.profile?.name?.split(' ')[0] || 'User'}
            </ThemedText>
            {/* <ThemedText style={{ color: muted, fontSize: 10 }} numberOfLines={1}>
                 @{user.profile?.name?.replace(/\s/g, '').toLowerCase()}
            </ThemedText> */}
        </TouchableOpacity>
    );

    const renderBlogItem = (blog: any) => (
        <TouchableOpacity
            key={blog.id}
            style={[styles.blogItem, { backgroundColor: cardColor }]}
            onPress={() => router.push(`/blog/${blog.id}`)}
        >
            <View style={styles.blogHeader}>
                <OptimizedImage
                    source={{ uri: blog.author?.profile?.avatar || 'https://ui-avatars.com/api/?name=Author' }}
                    style={styles.articleAuthorAvatar}
                    contentFit="cover"
                />
                <View>
                    <ThemedText style={{ color: text, fontSize: 13, fontWeight: '600' }}>
                        {blog.author?.profile?.name || 'Author'}
                    </ThemedText>
                    <ThemedText style={{ color: muted, fontSize: 11 }}>
                        {new Date(blog.createdAt).toLocaleDateString()}
                    </ThemedText>
                </View>
            </View>

            <ThemedText style={[styles.blogTitle, { color: text }]} numberOfLines={2}>{blog.title}</ThemedText>

            {blog.media?.[0]?.url && (
                <OptimizedImage
                    source={{ uri: blog.media[0].url }}
                    style={styles.blogImage}
                    contentFit="cover"
                />
            )}

            <ThemedText style={{ color: muted, fontSize: 13, lineHeight: 18 }} numberOfLines={2}>
                {blog.body}
            </ThemedText>
        </TouchableOpacity>
    );

    const tabs: { id: Tab; label: string }[] = [
        { id: 'all', label: t('explore.all', { defaultValue: 'All' }) },
        { id: 'places', label: t('explore.places', { defaultValue: 'Places' }) },
        { id: 'events', label: t('explore.events', { defaultValue: 'Events' }) },
        { id: 'people', label: 'People' },
        { id: 'blogs', label: 'Blogs' },
    ];

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            {/* ================= Header ================= */}
            <View style={[styles.header, { paddingTop: insets.top, backgroundColor: cardColor }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backBtn}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>

                    <View style={[styles.searchContainer, { backgroundColor: inputBg }]}>
                        <Ionicons name="search" size={20} color={muted} style={{ marginLeft: 10 }} />
                        <TextInput
                            style={[styles.input, { color: text }]}
                            placeholder={t('explore.searchPlaceholder', { defaultValue: "Search places, events..." })}
                            placeholderTextColor={muted}
                            value={query}
                            onChangeText={setQuery}
                            autoFocus
                            returnKeyType="search"
                        />
                        {query.length > 0 && (
                            <TouchableOpacity onPress={() => setQuery('')} style={{ padding: 8 }}>
                                <Ionicons name="close-circle" size={18} color={muted} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Tabs (Only visible if we have results or user is typing) */}
                {(hasResults || activeTab !== 'all') && (
                    <View style={styles.tabContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
                        >
                            {tabs.map(tab => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <TouchableOpacity
                                        key={tab.id}
                                        style={[
                                            styles.tab,
                                            {
                                                backgroundColor: isActive ? primary : bg,
                                                borderColor: isActive ? primary : border,
                                                borderWidth: 1
                                            }
                                        ]}
                                        onPress={() => setActiveTab(tab.id)}
                                    >
                                        <ThemedText style={{ color: isActive ? '#fff' : text, fontWeight: isActive ? '600' : '400', fontSize: 13 }}>
                                            {tab.label}
                                        </ThemedText>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}
            </View>

            {/* ================= Content ================= */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View style={{ marginTop: 60 }}>
                        <ActivityIndicator size="large" color={primary} />
                    </View>
                ) : !query ? (
                    <View style={styles.emptyState}>
                        <View style={[styles.iconCircle, { backgroundColor: inputBg }]}>
                            <Ionicons name="search" size={32} color={muted} />
                        </View>
                        <ThemedText style={[styles.emptyTitle, { color: text }]}>
                            {t('explore.startSearching', { defaultValue: "Explore Adama" })}
                        </ThemedText>
                        <ThemedText style={[styles.emptySubtitle, { color: muted }]}>
                            Search for hotels, events, people, and more.
                        </ThemedText>
                    </View>
                ) : !hasResults ? (
                    <View style={styles.emptyState}>
                        <ThemedText style={{ color: muted }}>
                            No results found for "{query}"
                        </ThemedText>
                    </View>
                ) : (
                    <>
                        {/* Users / People Section - Horizontal List */}
                        {(activeTab === 'all' || activeTab === 'people') && results.users.length > 0 && (
                            <View style={styles.section}>
                                {renderSectionHeader("People", 'people')}
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                                    {results.users.map(user => (
                                        <View key={user.id} style={{ marginRight: 16 }}>
                                            {renderUserItem(user)}
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {/* Places */}
                        {(activeTab === 'all' || activeTab === 'places') && results.places.length > 0 && (
                            <View style={styles.section}>
                                {renderSectionHeader(t('explore.places', { defaultValue: 'Places' }), 'places')}
                                {results.places.map(renderPlaceItem)}
                            </View>
                        )}

                        {/* Events */}
                        {(activeTab === 'all' || activeTab === 'events') && results.events.length > 0 && (
                            <View style={styles.section}>
                                {renderSectionHeader(t('explore.events', { defaultValue: 'Events' }), 'events')}
                                {results.events.map(renderEventItem)}
                            </View>
                        )}

                        {/* Blogs */}
                        {(activeTab === 'all' || activeTab === 'blogs') && results.blogPosts.length > 0 && (
                            <View style={styles.section}>
                                {renderSectionHeader("From the Blog", 'blogs')}
                                {results.blogPosts.map(renderBlogItem)}
                            </View>
                        )}

                        {/* Bottom Spacer */}
                        <View style={{ height: 40 }} />
                    </>
                )}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'transparent', // Can change to border color if desired
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 10,
        gap: 12,
    },
    backBtn: {
        padding: 4,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        borderRadius: 20,
    },
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 8,
        fontSize: 16,
    },
    tabContainer: {
        marginTop: 4,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 18,
    },
    scrollContent: {
        paddingTop: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },

    // Result Items
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 10,
        padding: 10,
        borderRadius: 16,
        // elevation: 1,
    },
    resultImage: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
    },
    resultContent: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    miniBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 4,
    },

    // User Item
    userItem: {
        alignItems: 'center',
        width: 60,
    },
    userAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f0f0f0',
    },

    // Blog Item
    blogItem: {
        marginHorizontal: 20,
        marginBottom: 14,
        padding: 16,
        borderRadius: 16,
    },
    blogHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    articleAuthorAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
        backgroundColor: '#f0f0f0',
    },
    blogTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
        lineHeight: 22,
    },
    blogImage: {
        width: '100%',
        height: 150,
        borderRadius: 12,
        marginBottom: 10,
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
        paddingHorizontal: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptySubtitle: {
        textAlign: 'center',
        lineHeight: 20,
    },
});
