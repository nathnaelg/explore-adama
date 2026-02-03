import { apiClient } from '@/src/core/api/client';
import {
    CreateReviewDto,
    Review,
    ReviewQueryParams
} from '../types';

export const reviewService = {
    // List reviews for an item
    async listReviews(params: ReviewQueryParams): Promise<{ data: Review[], total: number }> {
        const response = await apiClient.get('/reviews', { params });
        return response.data;
    },

    // Get review by ID
    async getReviewById(id: string): Promise<Review> {
        const response = await apiClient.get(`/reviews/${id}`);
        return response.data;
    },

    // Create review
    async createReview(data: CreateReviewDto): Promise<Review> {
        const response = await apiClient.post('/reviews', data);
        return response.data;
    },

    // Update review
    async updateReview(id: string, data: { rating?: number, comment?: string }): Promise<void> {
        await apiClient.put(`/reviews/${id}`, data);
    },

    // Delete review
    async deleteReview(id: string): Promise<void> {
        await apiClient.delete(`/reviews/${id}`);
    },

    // Admin: Moderate review
    async moderateReview(id: string, action: 'APPROVE' | 'REJECT' | 'HIDE', reason?: string): Promise<void> {
        await apiClient.post(`/reviews/admin/${id}/moderate`, { action, reason });
    },
};
