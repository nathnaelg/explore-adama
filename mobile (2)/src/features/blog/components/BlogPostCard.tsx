// /home/natye/smart-tourism/src/features/blog/components/BlogPostCard.tsx
import { ThemedText } from '@/src/components/themed/ThemedText';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BlogPost } from '../types';

interface BlogPostCardProps {
  post: BlogPost;
  onPress: () => void;
  onLike?: () => void;
  onComment?: () => void;
  showActions?: boolean;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  onPress,
  onLike,
  onComment,
  showActions = true,
}) => {
  const { t } = useTranslation();
  const bg = useThemeColor({}, 'bg');
  const card = useThemeColor({}, 'card');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const accent = useThemeColor({}, 'accent');
  const error = useThemeColor({}, 'error');
  const warning = useThemeColor({}, 'warning');

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const handleLikePress = () => {
    if (onLike) {
      onLike();
    }
  };

  // Get author location from profile
  const authorLocation = post.author?.profile
    ? (post.author.profile as any).country ||
    (post.author.profile as any).location ||
    undefined
    : undefined;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: card }]}
      onPress={onPress}
    >
      {/* Cover Image */}
      {post.media && post.media.length > 0 && (
        <Image
          source={{ uri: post.media[0].url }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        {/* Category & Date */}
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: `${primary}20` }]}>
            <ThemedText style={[styles.categoryText, { color: primary }]}>
              {post.category ? t(`blog.categories.${post.category.toLowerCase()}`, { defaultValue: post.category }) : t('blog.uncategorized')}
            </ThemedText>
          </View>
          <ThemedText style={[styles.dateText, { color: muted }]}>
            {formatDate(post.createdAt)}
          </ThemedText>
        </View>

        {/* Title */}
        <ThemedText style={[styles.title, { color: text }]} numberOfLines={2}>
          {post.title}
        </ThemedText>

        {/* Excerpt */}
        <ThemedText style={[styles.excerpt, { color: muted }]} numberOfLines={3}>
          {post.body.replace(/[#*`]/g, '').substring(0, 120)}...
        </ThemedText>

        {/* Author */}
        <View style={styles.authorContainer}>
          {post.author?.profile?.avatar ? (
            <Image
              source={{ uri: post.author.profile.avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, { backgroundColor: primary }]}>
              <ThemedText style={[styles.avatarText, { color: 'white' }]}>
                {post.author?.profile?.name?.charAt(0) || 'A'}
              </ThemedText>
            </View>
          )}
          <View style={styles.authorInfo}>
            <ThemedText style={[styles.authorName, { color: text }]}>
              {post.author?.profile?.name || t('blog.anonymous')}
            </ThemedText>
            {authorLocation && (
              <ThemedText style={[styles.authorLocation, { color: muted }]}>
                {authorLocation}
              </ThemedText>
            )}
          </View>
        </View>

        {/* Stats & Actions */}
        {showActions && (
          <View style={styles.footer}>
            <View style={styles.stats}>
              <TouchableOpacity style={styles.statButton} onPress={handleLikePress}>
                <Ionicons
                  name={post.isLiked ? "heart" : "heart-outline"}
                  size={18}
                  color={post.isLiked ? error : muted}
                />
                <ThemedText style={[styles.statText, { color: post.isLiked ? error : muted }]}>
                  {post.likesCount || 0}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statButton} onPress={onComment}>
                <Ionicons name="chatbubble-outline" size={18} color={muted} />
                <ThemedText style={[styles.statText, { color: muted }]}>
                  {post.comments?.length || post.commentCount || 0}
                </ThemedText>
              </TouchableOpacity>
              <View style={styles.statButton}>
                <Ionicons name="eye-outline" size={18} color={muted} />
                <ThemedText style={[styles.statText, { color: muted }]}>
                  {post.viewCount || 0}
                </ThemedText>
              </View>
            </View>

            {/* Status badge */}
            {post.status === 'PENDING' && (
              <View style={[styles.statusBadge, { backgroundColor: warning + '20' }]}>
                <ThemedText style={[styles.statusText, { color: warning }]}>
                  {t('blog.pending')}
                </ThemedText>
              </View>
            )}
            {post.status === 'REJECTED' && (
              <View style={[styles.statusBadge, { backgroundColor: error + '20' }]}>
                <ThemedText style={[styles.statusText, { color: error }]}>
                  {t('blog.rejected')}
                </ThemedText>
              </View>
            )}
          </View>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {post.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: `${accent}20` }]}>
                <ThemedText style={[styles.tagText, { color: accent }]}>
                  #{tag}
                </ThemedText>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
  },
  authorLocation: {
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
  },
});