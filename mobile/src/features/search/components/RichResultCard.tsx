import { HighlightText } from '@/src/components/common/HighlightText';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { BlogPost } from '@/src/features/blog/types';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface RichResultCardProps {
    post: BlogPost;
    searchQuery: string;
    onPress: () => void;
}

export const RichResultCard: React.FC<RichResultCardProps> = ({ post, searchQuery, onPress }) => {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const accent = useThemeColor({}, 'accent');

    const formatDate = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'Recently';
        }
    };

    // Get author location from profile (if available)
    const authorLocation = post.author?.profile
        ? (post.author.profile as any).country || (post.author.profile as any).location
        : undefined;

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: card }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.authorRow}>
                    {/* Avatar */}
                    {post.author?.profile?.avatar ? (
                        <Image source={{ uri: post.author.profile.avatar }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, { backgroundColor: primary }]}>
                            <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>
                                {post.author?.profile?.name?.charAt(0) || 'A'}
                            </ThemedText>
                        </View>
                    )}

                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <ThemedText style={[styles.authorName, { color: text }]} numberOfLines={1}>
                                {post.author?.profile?.name || 'Anonymous'}
                            </ThemedText>
                            {/* Verified Badge or Location could go here */}
                        </View>
                        {authorLocation && (
                            <ThemedText style={{ fontSize: 11, color: muted }}>{authorLocation}</ThemedText>
                        )}
                    </View>

                    {/* Time */}
                    <ThemedText style={{ fontSize: 12, color: muted }}>
                        {formatDate(post.createdAt)}
                    </ThemedText>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Category Label */}
                <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                    <View style={[styles.categoryBadge, { backgroundColor: `${primary}15` }]}>
                        <ThemedText style={{ fontSize: 10, color: primary, fontWeight: '600' }}>
                            {post.category || 'Blog'}
                        </ThemedText>
                    </View>
                </View>

                {/* Title with Highlight */}
                <HighlightText
                    text={post.title}
                    term={searchQuery}
                    style={[styles.title, { color: text }]}
                    numberOfLines={2}
                />

                {/* Body Snippet with Highlight */}
                <HighlightText
                    text={post.body.replace(/[#*`]/g, '').substring(0, 100) + '...'}
                    term={searchQuery}
                    style={[styles.body, { color: muted }]}
                    numberOfLines={3}
                />
            </View>

            {/* Footer Stats */}
            <View style={[styles.footer, { borderTopColor: bg }]}>
                <View style={styles.stat}>
                    <Ionicons name="heart-outline" size={16} color={muted} />
                    <ThemedText style={[styles.statText, { color: muted }]}>{post.likesCount || 0}</ThemedText>
                </View>
                <View style={styles.stat}>
                    <Ionicons name="chatbubble-outline" size={16} color={muted} />
                    <ThemedText style={[styles.statText, { color: muted }]}>{post.commentCount || 0}</ThemedText>
                </View>
                <View style={styles.stat}>
                    <Ionicons name="eye-outline" size={16} color={muted} />
                    <ThemedText style={[styles.statText, { color: muted }]}>{post.viewCount || 0}</ThemedText>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    header: {
        marginBottom: 12,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    authorName: {
        fontSize: 14,
        fontWeight: '700',
    },
    content: {
        marginBottom: 12,
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
        lineHeight: 22,
    },
    body: {
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        gap: 20,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 12,
    },
});
