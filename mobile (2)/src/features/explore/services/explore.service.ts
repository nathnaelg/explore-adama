import { apiClient } from '@/src/core/api/client';
import {
    Category,
    CreatePlaceDto,
    NearbyParams,
    Place,
    PlaceQueryParams
} from '../types';

export const exploreService = {
    // List places with optional filtering
    async listPlaces(params: PlaceQueryParams = {}): Promise<{ data: Place[], total: number }> {
        const response = await apiClient.get('/places', { params });
        if (Array.isArray(response.data)) {
            return { data: response.data, total: response.data.length };
        }
        return response.data;
    },

    // Get single place details
    async getPlaceById(id: string): Promise<Place> {
        const response = await apiClient.get(`/places/${id}`);
        // Handle wrapped response
        if (response.data && 'data' in response.data) {
            return response.data.data;
        }
        return response.data;
    },

    // Get nearby places
    async getNearbyPlaces(params: NearbyParams): Promise<{ data: Place[] }> {
        const response = await apiClient.get('/places/nearby', { params });
        if (Array.isArray(response.data)) {
            return { data: response.data };
        }
        return response.data;
    },

    // List categories
    async listCategories(): Promise<Category[]> {
        const response = await apiClient.get('/categories');
        if (!Array.isArray(response.data) && response.data?.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return response.data;
    },

    // Admin: Create place
    async createPlace(data: CreatePlaceDto): Promise<Place> {
        const response = await apiClient.post('/places', data);
        return response.data;
    },

    // Admin: Update place
    async updatePlace(id: string, data: CreatePlaceDto): Promise<Place> {
        const response = await apiClient.put(`/places/${id}`, data);
        return response.data;
    },

    // Admin: Delete place
    async deletePlace(id: string): Promise<void> {
        await apiClient.delete(`/places/${id}`);
    },

    // Admin: Upload place image
    async uploadPlaceImage(id: string, formData: FormData): Promise<void> {
        await apiClient.post(`/places/${id}/images`, formData, {
            headers: {
                'Content-Type': null as any,
            },
        });
    },
};
