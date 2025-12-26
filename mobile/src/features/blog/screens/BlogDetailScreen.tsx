
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { useAddBlogComment, useBlogComments, useBlogPost } from '@/src/features/blog/hooks/useBlog';
import { blogService } from '@/src/features/blog/services/blog.service';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { useState } from 'react';
import {
    ActivityIndicator,
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
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user, isGuest } = useAuth();

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const accent = useThemeColor({}, 'accent');
    const chip = useThemeColor({}, 'chip');
    const warning = useThemeColor({}, 'warning');
    const error = useThemeColor({}, 'error');

    const { data: post, isLoading: postLoading, error: postError, refetch: refetchPost } = useBlogPost(id || '');
    const { data: comments = [], isLoading: commentsLoading, refetch: refetchComments } = useBlogComments(id || '');
    const { mutate: addComment, isPending: submittingComment } = useAddBlogComment(id || '');

    const [commentText, setCommentText] = useState('');
    const [liked, setLiked] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);

    const isAuthor = user?.id === post?.authorId;
    const isAdmin = user?.role === 'ADMIN';

    const onRefresh = () => {
        refetchPost();
        refetchComments();
    };

    const handleLike = () => {
        if (isGuest) {
            router.push({
                pathname: '/(modals)/guest-prompt',
                params: {
                    title: 'Sign In Required',
                    message: 'Sign in to like this story and let the author know you enjoyed it!',
                    icon: 'heart-outline'
                }
            });
            return;
        }
        setLiked(!liked);
        // Backend doesn't support like yet, so we just toggle local state UI-wise
    };

    const handleAddComment = () => {
        if (isGuest) {
            router.push({
                pathname: '/(modals)/guest-prompt',
                params: {
                    title: 'Sign In Required',
                    message: 'Please sign in to join the conversation.',
                    icon: 'chatbubble-outline'
                }
            });
            return;
        }
        if (!commentText.trim()) return;

        addComment({ content: commentText }, {
            onSuccess: () => {
                setCommentText('');
                Alert.alert('Success', 'Comment added');
            },
            onError: (err: any) => {
                Alert.alert('Error', err?.response?.data?.message || 'Failed to add comment');
            }
        });
    };

    const handleModeratePost = () => {
        Alert.alert(
            'Moderate Post',
            'Select moderation action:',
            [
                { text: 'Approve', onPress: () => moderatePost('APPROVE'), style: 'default' },
                { text: 'Reject', onPress: () => moderatePost('REJECT'), style: 'destructive' },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const moderatePost = async (action: 'APPROVE' | 'REJECT' | 'PENDING') => {
        try {
            const reason = action === 'REJECT' ? 'Inappropriate content' : undefined;
            await blogService.moderateBlogPost(id || '', { action, reason });
            onRefresh();
            Alert.alert('Success', `Post ${action.toLowerCase()}d`);
        } catch (error) {
            Alert.alert('Error', 'Failed to moderate post');
        }
    };

    if (postLoading) {
        return (
            <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={primary} />
            </ThemedView>
        );
    }

    if (postError || !post) {
        return (
            <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Ionicons name="alert-circle-outline" size={60} color={error} />
                <ThemedText style={{ marginTop: 16 }}>Post not found</ThemedText>
                <TouchableOpacity onPress={() => router.back()}>
                    <ThemedText style={{ color: primary, marginTop: 16 }}>Go Back</ThemedText>
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
                    <RefreshControl refreshing={postLoading} onRefresh={onRefresh} tintColor={primary} />
                }
            >
                {/* Header */}
                <View style={[styles.header, { backgroundColor: card }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <ThemedText style={[styles.headerTitle, { color: text }]}>Blog Post</ThemedText>
                    <View style={styles.headerActions}>
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
                                {post.category || 'Uncategorized'}
                            </ThemedText>
                        </View>
                        {post.status !== 'APPROVED' && (
                            <View style={[styles.statusBadge, { backgroundColor: post.status === 'PENDING' ? warning + '20' : error + '20' }]}>
                                <ThemedText style={[styles.statusText, { color: post.status === 'PENDING' ? warning : error }]}>
                                    {post.status}
                                </ThemedText>
                            </View>
                        )}
                    </View>

                    <ThemedText style={[styles.title, { color: text }]}>{post.title}</ThemedText>

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
                            <ThemedText style={styles.authorName}>{post.author?.profile?.name || 'Anonymous'}</ThemedText>
                            <ThemedText style={[styles.date, { color: muted }]}>
                                {format(new Date(post.createdAt), 'MMM d, yyyy')}
                            </ThemedText>
                        </View>
                    </View>

                    {/* Body */}
                    <View style={styles.bodyContainer}>
                        <Markdown style={{
                            body: { color: text, fontSize: 16, lineHeight: 24 },
                            paragraph: { marginVertical: 8 },
                        }}>
                            {post.body}
                        </Markdown>
                    </View>

                    {/* Comments */}
                    <View style={styles.commentsContainer}>
                        <ThemedText type="subtitle" style={styles.commentsTitle}>Comments ({comments.length})</ThemedText>

                        <View style={[styles.addCommentContainer, { backgroundColor: card }]}>
                            <TextInput
                                style={[styles.commentInput, { color: text }]}
                                placeholder="Add a comment..."
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
                                {submittingComment ? <ActivityIndicator size="small" color="white" /> : <Ionicons name="send" size={18} color="white" />}
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
                                <ThemedText style={{ color: primary, textAlign: 'center', marginTop: 12 }}>Show more comments</ThemedText>
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
});
