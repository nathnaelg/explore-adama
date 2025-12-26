import { apiClient } from '@/src/core/api/client';
import {
    AddFavoriteDto,
    Favorite,
    Interaction,
    RecordInteractionDto
} from '../types';

export const interactionService = {
    // Record user interaction (view, click, etc.)
    async recordInteraction(data: RecordInteractionDto): Promise<void> {
        await apiClient.post('/interactions', data);
    },

    // List user interactions (Admin)
    async listInteractions(): Promise<Interaction[]> {
        const response = await apiClient.get('/interactions');
        return response.data;
    },

    // Favorites management
    async listFavorites(): Promise<Favorite[]> {
        const response = await apiClient.get('/favorites');
        return response.data;
    },

    async addFavorite(data: AddFavoriteDto): Promise<void> {
        await apiClient.post('/favorites', data);
    },

    async removeFavorite(data: AddFavoriteDto): Promise<void> {
        await apiClient.delete('/favorites', { data });
    },

    async checkFavorite(itemId: string, itemType: string): Promise<boolean> {
        const response = await apiClient.get('/favorites/check', {
            params: { itemId, itemType }
        });
        return response.data;
    },
};
