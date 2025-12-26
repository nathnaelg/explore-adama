import { apiClient } from '@/src/core/api/client';
import {
  BlogListResponse,
  BlogPost,
  BlogQueryParams,
  CreateBlogCommentDto,
  CreateBlogPostDto,
  ModerateBlogPostDto,
  UpdateBlogPostDto
} from '../types';

export const blogService = {
  // Get all blog posts
  async getBlogPosts(params?: BlogQueryParams): Promise<BlogListResponse> {
    const response = await apiClient.get('/blog', { params });
    if (Array.isArray(response.data)) {
      return { items: response.data, page: 1, limit: response.data.length, total: response.data.length };
    }
    return response.data;
  },

  // Get single blog post
  async getBlogPost(id: string): Promise<BlogPost> {
    const response = await apiClient.get(`/blog/${id}`);
    return response.data;
  },

  // Create blog post
  async createBlogPost(data: CreateBlogPostDto): Promise<BlogPost> {
    const response = await apiClient.post('/blog', data);
    return response.data;
  },

  // Update blog post
  async updateBlogPost(id: string, data: UpdateBlogPostDto): Promise<BlogPost> {
    const response = await apiClient.patch(`/blog/${id}`, data);
    return response.data;
  },

  // Delete blog post (admin only)
  async deleteBlogPost(id: string): Promise<void> {
    await apiClient.delete(`/blog/${id}`);
  },

  // Upload media to blog post
  async uploadMedia(postId: string, file: FormData): Promise<any> {
    const response = await apiClient.post(`/blog/${postId}/media`, file, {
      headers: {
        'Content-Type': null as any,
      },
    });
    return response.data;
  },

  // Get blog post comments
  async getComments(postId: string): Promise<any[]> {
    const response = await apiClient.get(`/blog/${postId}/comments`);
    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  // Add comment to blog post
  async addComment(postId: string, data: CreateBlogCommentDto): Promise<any> {
    const response = await apiClient.post(`/blog/${postId}/comments`, data);
    return response.data;
  },

  // Moderate blog post (admin only)
  async moderateBlogPost(id: string, data: ModerateBlogPostDto): Promise<BlogPost> {
    const response = await apiClient.post(`/blog/${id}/moderate`, data);
    return response.data;
  },

  // We remove the following methods because the endpoints don't exist in the backend:
  // - likeBlogPost
  // - unlikeBlogPost
  // - incrementViewCount
  // - getUserBlogPosts
  // - getCategories
  // - getPopularTags

  // Instead, we can create helper functions to extract categories and tags from posts (client-side)
  extractCategoriesFromPosts(posts: BlogPost[]): string[] {
    const categories = new Set<string>();
    posts.forEach(post => {
      if (post.category) {
        categories.add(post.category);
      }
    });
    return Array.from(categories);
  },

  extractPopularTagsFromPosts(posts: BlogPost[], limit: number = 10): string[] {
    const tagCounts: Record<string, number> = {};
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    // Sort tags by count and get the top ones
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => tag);
  },
};