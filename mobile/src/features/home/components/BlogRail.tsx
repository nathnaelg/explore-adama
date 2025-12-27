import { OptimizedImage } from '@/src/components/common/OptimizedImage';
import { Skeleton } from '@/src/components/common/Skeleton';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { useBlogPosts } from '@/src/features/blog/hooks/useBlog';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export function BlogRail() {
    const { t } = useTranslation();
    const { data, isLoading } = useBlogPosts({ limit: 5 });
    const posts = data?.items || [];
    const cardColor = useThemeColor({}, 'card');
    const primary = useThemeColor({}, 'primary');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');

    if (isLoading) return <BlogRailSkeleton />;
    if (posts.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="subtitle" style={styles.title}>{t('home.blogsStories')} ✍️</ThemedText>
                <TouchableOpacity onPress={() => router.push('/(tabs)/blog')}>
                    <ThemedText style={{ color: primary, fontWeight: '600' }}>{t('common.seeAll')}</ThemedText>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
                {posts.map((post) => {
                    const coverImage = post.media?.find(m => m.type === 'IMAGE')?.url || post.media?.[0]?.url;
                    const authorName = post.author?.profile?.name || t('common.traveler');
                    const authorInitial = authorName[0] || 'T';

                    return (
                        <TouchableOpacity
                            key={post.id}
                            style={[styles.card, { backgroundColor: cardColor }]}
                            onPress={() => router.push(`/blog/${post.id}`)}
                        >
                            <OptimizedImage
                                source={{ uri: coverImage || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40' }}
                                style={styles.image}
                                contentFit="cover"
                            />
                            <View style={styles.content}>
                                <ThemedText style={[styles.cardTitle, { color: text }]} numberOfLines={2}>{post.title}</ThemedText>
                                <View style={styles.authorRow}>
                                    <View style={[styles.avatar, { backgroundColor: primary }]}>
                                        <ThemedText style={{ color: 'white', fontSize: 10 }}>{authorInitial}</ThemedText>
                                    </View>
                                    <ThemedText style={[styles.authorName, { color: muted }]} numberOfLines={1}>
                                        {authorName}
                                    </ThemedText>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

export function BlogRailSkeleton() {
    const { t } = useTranslation();
    const cardColor = useThemeColor({}, 'card');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="subtitle" style={styles.title}>{t('home.blogsStories')} ✍️</ThemedText>
                <Skeleton width={60} height={16} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={[styles.card, { backgroundColor: cardColor }]}>
                        <Skeleton width="100%" height={120} />
                        <View style={styles.content}>
                            <Skeleton width="90%" height={14} style={{ marginBottom: 8 }} />
                            <Skeleton width="70%" height={14} style={{ marginBottom: 12 }} />
                            <View style={styles.authorRow}>
                                <Skeleton width={20} height={20} borderRadius={10} />
                                <Skeleton width={80} height={12} />
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    list: {
        paddingHorizontal: 20,
        gap: 16,
    },
    card: {
        width: 200,
        borderRadius: 16,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 120,
    },
    content: {
        padding: 12,
        gap: 8,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 20,
        height: 40,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    authorName: {
        fontSize: 12,
        flex: 1,
    },
});
