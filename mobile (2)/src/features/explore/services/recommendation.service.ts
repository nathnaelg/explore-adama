import { apiClient } from '@/src/core/api/client';
import { GlobalRecommendations } from '../types';

export const recommendationService = {
    // Get global recommendations (popular events and places)
    async getGlobalRecommendations(): Promise<GlobalRecommendations> {
        const response = await apiClient.get('/recommendations/global');
        return response.data;
    },
};
