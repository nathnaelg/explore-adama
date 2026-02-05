import { apiClient } from '@/src/core/api/client';

export interface SearchResults {
    places: any[];
    events: any[];
    categories: any[];
    blogPosts: any[];
    users: any[];
}

export const searchService = {
    search: async (query: string): Promise<SearchResults> => {
        const response = await apiClient.get('/search', { params: { q: query } });
        return response.data.data;
    }
};
