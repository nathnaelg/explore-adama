import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { blogService } from '../services/blog.service';
import { BlogQueryParams, CreateBlogCommentDto, CreateBlogPostDto, UpdateBlogPostDto } from '../types';

export const useBlogPosts = (params: BlogQueryParams = {}) => {
    return useQuery({
        queryKey: ['blog-posts', params],
        queryFn: () => blogService.getBlogPosts(params),
    });
};

export const useBlogPost = (id: string) => {
    return useQuery({
        queryKey: ['blog-post', id],
        queryFn: () => blogService.getBlogPost(id),
        enabled: !!id,
    });
};

export const useBlogComments = (postId: string) => {
    return useQuery({
        queryKey: ['blog-comments', postId],
        queryFn: () => blogService.getComments(postId),
        enabled: !!postId,
    });
};

export const useCreateBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBlogPostDto) => blogService.createBlogPost(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
        },
    });
};

export const useUpdateBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: UpdateBlogPostDto }) =>
            blogService.updateBlogPost(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
            queryClient.invalidateQueries({ queryKey: ['blog-post', variables.id] });
        },
    });
};

export const useAddBlogComment = (postId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBlogCommentDto) => blogService.addComment(postId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-comments', postId] });
        },
    });
};

export const useToggleLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => blogService.toggleLike(postId),
        onSuccess: (_, postId) => {
            // Invalidate queries to refresh counts/status
            queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
            queryClient.invalidateQueries({ queryKey: ['blog-post', postId] });
        }
    });
};
