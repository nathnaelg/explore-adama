import { apiClient } from '@/src/core/api/client';
import { Favorite } from '../types';

export const favoriteService = {
    // Get all favorites
    async getFavorites(): Promise<Favorite[]> {
        const response = await apiClient.get('/favorites');
        if (response.data && !Array.isArray(response.data) && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return Array.isArray(response.data) ? response.data : [];
    },

    // Add favorite
    async addFavorite(itemId: string, itemType: 'PLACE' | 'EVENT'): Promise<Favorite> {
        const response = await apiClient.post('/favorites', { itemId, itemType });
        return response.data;
    },

    // Remove favorite (Swagger says DELETE /favorites with body, but Axios delete body syntax is specific)
    // Wait, Swagger says DELETE /favorites requestBody: AddFavoriteDto.
    // Standard REST usually uses query or path. Let's check Swagger again.
    // DELETE /favorites has requestBody... odd for DELETE but possible.
    async removeFavorite(itemId: string, itemType: 'PLACE' | 'EVENT'): Promise<void> {
        await apiClient.delete('/favorites', {
            data: { itemId, itemType }
        });
    }
};
