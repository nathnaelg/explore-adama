import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../services/blog.service";
import {
  BlogQueryParams,
  CreateBlogCommentDto,
  CreateBlogPostDto,
  UpdateBlogPostDto,
} from "../types";

export const useBlogPosts = (params: BlogQueryParams = {}) => {
  return useQuery({
    queryKey: ["blog-posts", params],
    queryFn: () => blogService.getBlogPosts(params),
    refetchInterval: 30000,
  });
};

export const useBlogPost = (id: string) => {
  return useQuery({
    queryKey: ["blog-post", id],
    queryFn: () => blogService.getBlogPost(id),
    enabled: !!id,
    refetchInterval: 30000,
  });
};

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => blogService.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useBlogComments = (postId: string) => {
  return useQuery({
    queryKey: ["blog-comments", postId],
    queryFn: () => blogService.getComments(postId),
    enabled: !!postId,
    refetchInterval: 30000,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlogPostDto) => blogService.createBlogPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogPostDto }) =>
      blogService.updateBlogPost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post", variables.id] });
    },
  });
};

export const useAddBlogComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlogCommentDto) =>
      blogService.addComment(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-comments", postId] });
    },
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => blogService.toggleLike(postId),
    onMutate: async (postId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["blog-post", postId] });
      await queryClient.cancelQueries({ queryKey: ["blog-posts"] });

      // Snapshot the previous value
      const previousPost = queryClient.getQueryData(["blog-post", postId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["blog-post", postId], (old: any) => {
        if (!old) return old;
        const wasLiked = old.isLiked;
        return {
          ...old,
          isLiked: !wasLiked,
          likesCount: wasLiked ? (old.likesCount || 0) - 1 : (old.likesCount || 0) + 1,
        };
      });

      // Also update the list if it exists
      queryClient.setQueriesData({ queryKey: ["blog-posts"] }, (old: any) => {
        if (!old?.items) return old;
        return {
          ...old,
          items: old.items.map((post: any) => {
            if (post.id === postId) {
              const wasLiked = post.isLiked;
              return {
                ...post,
                isLiked: !wasLiked,
                likesCount: wasLiked ? (post.likesCount || 0) - 1 : (post.likesCount || 0) + 1,
              };
            }
            return post;
          })
        };
      });

      // Return a context object with the snapshotted value
      return { previousPost };
    },
    onError: (err, postId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPost) {
        queryClient.setQueryData(["blog-post", postId], context.previousPost);
      }
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
    onSettled: (data, error, postId) => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ["blog-post", postId] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });
};
