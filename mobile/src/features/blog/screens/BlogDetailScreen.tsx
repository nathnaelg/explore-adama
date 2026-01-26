
import { Skeleton } from '@/src/components/common/Skeleton';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { BlogDetailSkeleton } from '@/src/features/blog/components/BlogDetailSkeleton';
import { useAddBlogComment, useBlogComments, useBlogPost, useToggleLike } from '@/src/features/blog/hooks/useBlog';
import { blogService } from '@/src/features/blog/services/blog.service';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';

export default function BlogDetailScreen() {
    const { t, i18n } = useTranslation();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user, isAuthenticated } = useAuth();

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const accent = useThemeColor({}, 'accent');
    const chip = useThemeColor({}, 'chip');
    const warning = useThemeColor({}, 'warning');
    const error = useThemeColor({}, 'error');

    const { data: post, isLoading: postLoading, isRefetching: postRefetching, error: postError, refetch: refetchPost } = useBlogPost(id || '');
    const { data: comments = [], isLoading: commentsLoading, isRefetching: commentsRefetching, refetch: refetchComments } = useBlogComments(id || '');
    const { mutate: addComment, isPending: submittingComment } = useAddBlogComment(id || '');
    const { mutate: toggleLike } = useToggleLike();

    const [commentText, setCommentText] = useState('');
    // const [liked, setLiked] = useState(false); // Removed local state
    const [showAllComments, setShowAllComments] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translatedContent, setTranslatedContent] = useState<{ title: string; body: string } | null>(null);
    const [showOriginal, setShowOriginal] = useState(true);
    const [isManualRefreshing, setIsManualRefreshing] = useState(false);

    const isAuthor = user?.id === post?.authorId;
    const isAdmin = user?.role === 'ADMIN';

    const onRefresh = async () => {
        setIsManualRefreshing(true);
        await Promise.all([refetchPost(), refetchComments()]);
        setIsManualRefreshing(false);
    };

    // React.useEffect(() => {
    //     if (post) {
    //         setLiked(post.isLiked || false);
    //     }
    // }, [post]);

    const handleLike = async () => {
        if (!isAuthenticated) {
            router.push('/(auth)/login');
            return;
        }

        toggleLike(id || '');
    };

    const handleAddComment = () => {
        if (!isAuthenticated) {
            router.push('/(auth)/login');
            return;
        }
        if (!commentText.trim()) return;

        addComment({ content: commentText }, {
            onSuccess: () => {
                setCommentText('');
            },
            onError: (err: any) => {
                Alert.alert(t('common.error'), err?.response?.data?.message || t('blog.failedAddComment'));
            }
        });
    };

    const handleModeratePost = () => {
        Alert.alert(
            t('blog.moderatePost'),
            t('blog.selectModerationAction'),
            [
                { text: t('blog.approve'), onPress: () => moderatePost('APPROVE'), style: 'default' },
                { text: t('blog.reject'), onPress: () => moderatePost('REJECT'), style: 'destructive' },
                { text: t('common.cancel'), style: 'cancel' },
            ]
        );
    };

    const moderatePost = async (action: 'APPROVE' | 'REJECT' | 'PENDING') => {
        try {
            const reason = action === 'REJECT' ? 'Inappropriate content' : undefined;
            await blogService.moderateBlogPost(id || '', { action, reason });
            onRefresh();
            Alert.alert(t('common.success'), action === 'APPROVE' ? t('blog.postApproved') : t('blog.postRejected'));
        } catch (error) {
            Alert.alert(t('common.error'), t('common.error'));
        }
    };

    const handleTranslate = async () => {
        if (!showOriginal) {
            setShowOriginal(true);
            return;
        }

        if (translatedContent) {
            setShowOriginal(false);
            return;
        }

        try {
            setIsTranslating(true);
            const targetLang = i18n.language; // Use current app language
            const result = await blogService.translatePost(id || '', targetLang);
            setTranslatedContent({ title: result.title, body: result.body });
            setShowOriginal(false);
        } catch (error: any) {
            Alert.alert(t('common.error'), t('blog.translationFailed'));
        } finally {
            setIsTranslating(false);
        }
    };

    if (postLoading) {
        return <BlogDetailSkeleton />;
    }

    if (postError || !post) {
        return (
            <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Ionicons name="alert-circle-outline" size={60} color={error} />
                <ThemedText style={{ marginTop: 16 }}>{t('blog.postNotFound')}</ThemedText>
                <TouchableOpacity onPress={() => router.back()}>
                    <ThemedText style={{ color: primary, marginTop: 16 }}>{t('common.back')}</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    const displayedComments = showAllComments ? comments : comments.slice(0, 3);

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isManualRefreshing} onRefresh={onRefresh} tintColor={primary} />
                }
            >
                {/* Header */}
                <View style={[styles.header, { backgroundColor: card }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <ThemedText style={[styles.headerTitle, { color: text }]}>{t('blog.blogPost')}</ThemedText>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={handleTranslate} style={styles.headerAction} disabled={isTranslating}>
                            {isTranslating ? (
                                <Skeleton width={20} height={20} borderRadius={10} />
                            ) : (
                                <Ionicons
                                    name={showOriginal ? "language-outline" : "document-text-outline"}
                                    size={22}
                                    color={primary}
                                />
                            )}
                        </TouchableOpacity>
                        {(isAuthor || isAdmin) && (
                            <TouchableOpacity onPress={() => router.push(`/blog/${id}/edit`)} style={styles.headerAction}>
                                <Ionicons name="create-outline" size={22} color={primary} />
                            </TouchableOpacity>
                        )}
                        {isAdmin && (
                            <TouchableOpacity onPress={handleModeratePost} style={styles.headerAction}>
                                <Ionicons name="shield-outline" size={22} color={primary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Cover Image */}
                {post.media && post.media.length > 0 && (
                    <Image
                        source={{ uri: post.media[0].url }}
                        style={styles.coverImage}
                        resizeMode="cover"
                    />
                )}

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.metaContainer}>
                        <View style={[styles.categoryBadge, { backgroundColor: `${primary}20` }]}>
                            <ThemedText style={[styles.categoryText, { color: primary }]}>
                                {post.category ? t(`blog.categories.${post.category.toLowerCase()}`, { defaultValue: post.category }) : t('blog.uncategorized')}
                            </ThemedText>
                        </View>
                        {post.status !== 'APPROVED' && (
                            <View style={[styles.statusBadge, { backgroundColor: post.status === 'PENDING' ? warning + '20' : error + '20' }]}>
                                <ThemedText style={[styles.statusText, { color: post.status === 'PENDING' ? warning : error }]}>
                                    {post.status === 'PENDING' ? t('blog.pending') : t('blog.rejected')}
                                </ThemedText>
                            </View>
                        )}
                    </View>

                    <ThemedText style={[styles.title, { color: text }]}>
                        {showOriginal ? post.title : translatedContent?.title}
                    </ThemedText>

                    {/* Author */}
                    <View style={styles.authorInfo}>
                        <View style={[styles.authorAvatar, { backgroundColor: primary }]}>
                            {post.author?.profile?.avatar ? (
                                <Image source={{ uri: post.author.profile.avatar }} style={styles.authorAvatar} />
                            ) : (
                                <ThemedText style={{ color: 'white' }}>{post.author?.profile?.name?.[0] || 'A'}</ThemedText>
                            )}
                        </View>
                        <View>
                            <ThemedText style={styles.authorName}>{post.author?.profile?.name || t('blog.anonymous')}</ThemedText>
                            <ThemedText style={[styles.date, { color: muted }]}>
                                {format(new Date(post.createdAt), 'MMM d, yyyy')} • {post.viewCount || 0} views
                            </ThemedText>
                        </View>
                    </View>

                    {/* Interactions Bar */}
                    <View style={[styles.interactionsBar, { borderColor: muted + '40' }]}>
                        <TouchableOpacity
                            style={styles.interactionButton}
                            onPress={handleLike}
                        >
                            <Ionicons
                                name={post.isLiked ? "heart" : "heart-outline"}
                                size={24}
                                color={post.isLiked ? error : text}
                            />
                            <ThemedText style={[styles.interactionText, { color: text }]}>
                                {post.likesCount || 0}
                            </ThemedText>
                        </TouchableOpacity>

                        <View style={styles.interactionButton}>
                            <Ionicons name="chatbubble-outline" size={22} color={text} />
                            <ThemedText style={[styles.interactionText, { color: text }]}>
                                {comments.length}
                            </ThemedText>
                        </View>

                        <TouchableOpacity style={styles.interactionButton}>
                            <Ionicons name="share-social-outline" size={22} color={text} />
                        </TouchableOpacity>
                    </View>

                    {/* Body */}
                    <View style={styles.bodyContainer}>
                        {!showOriginal && (
                            <View style={[styles.translationLabel, { backgroundColor: primary + '10' }]}>
                                <Ionicons name="sparkles" size={14} color={primary} />
                                <ThemedText style={[styles.translationLabelText, { color: primary }]}>
                                    {t('blog.translatedByAi')}
                                </ThemedText>
                            </View>
                        )}
                        <Markdown style={{
                            body: { color: text, fontSize: 16, lineHeight: 24 },
                            paragraph: { marginVertical: 8 },
                        }}>
                            {showOriginal ? post.body : (translatedContent?.body || post.body)}
                        </Markdown>
                    </View>

                    {/* Comments */}
                    <View style={styles.commentsContainer}>
                        <ThemedText type="subtitle" style={styles.commentsTitle}>{t('blog.commentsCount', { count: comments.length })}</ThemedText>

                        <View style={[styles.addCommentContainer, { backgroundColor: card }]}>
                            <TextInput
                                style={[styles.commentInput, { color: text }]}
                                placeholder={t('blog.addComment')}
                                placeholderTextColor={muted}
                                value={commentText}
                                onChangeText={setCommentText}
                                multiline
                            />
                            <TouchableOpacity
                                disabled={submittingComment || !commentText.trim()}
                                onPress={handleAddComment}
                                style={[styles.commentButton, { backgroundColor: primary }]}
                            >
                                {submittingComment ? <Skeleton width={18} height={18} borderRadius={9} /> : <Ionicons name="send" size={18} color="white" />}
                            </TouchableOpacity>
                        </View>

                        {displayedComments.map((comment) => (
                            <View key={comment.id} style={[styles.commentItem, { borderBottomColor: muted + '20' }]}>
                                <View style={styles.commentHeader}>
                                    <ThemedText style={styles.commentAuthor}>{comment.user?.profile?.name || 'User'}</ThemedText>
                                    <ThemedText style={[styles.commentDate, { color: muted }]}>{format(new Date(comment.createdAt), 'MMM d')}</ThemedText>
                                </View>
                                <ThemedText style={styles.commentContent}>{comment.content}</ThemedText>
                            </View>
                        ))}

                        {comments.length > 3 && !showAllComments && (
                            <TouchableOpacity onPress={() => setShowAllComments(true)}>
                                <ThemedText style={{ color: primary, textAlign: 'center', marginTop: 12 }}>{t('blog.showMoreComments')}</ThemedText>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>


        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
    backButton: { marginRight: 16 },
    headerTitle: { flex: 1, fontSize: 18, fontWeight: '600' },
    headerActions: { flexDirection: 'row', gap: 12 },
    headerAction: { padding: 4 },
    coverImage: { width: '100%', height: 250 },
    content: { padding: 20 },
    metaContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    categoryBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
    categoryText: { fontSize: 12, fontWeight: '600' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
    statusText: { fontSize: 12, fontWeight: '600' },
    title: { fontSize: 28, fontWeight: '700', lineHeight: 34, marginBottom: 16 },
    authorInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
    authorAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    authorName: { fontWeight: '600', fontSize: 16 },
    date: { fontSize: 14 },
    bodyContainer: { marginBottom: 32 },
    commentsContainer: { marginTop: 24 },
    commentsTitle: { fontSize: 20, marginBottom: 16 },
    addCommentContainer: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 12, marginBottom: 20 },
    commentInput: { flex: 1, padding: 8, maxHeight: 100 },
    commentButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
    commentItem: { marginBottom: 16, borderBottomWidth: 1, paddingBottom: 12 },
    commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    commentAuthor: { fontWeight: '600', fontSize: 14 },
    commentDate: { fontSize: 12 },
    commentContent: { fontSize: 14, lineHeight: 20 },
    translationLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    translationLabelText: {
        fontSize: 12,
        fontWeight: '600',
    },
    interactionsBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginBottom: 24,
        gap: 24
    },
    interactionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    interactionText: {
        fontSize: 14,
        fontWeight: '500'
    }
});
