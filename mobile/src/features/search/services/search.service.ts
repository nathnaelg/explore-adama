import { apiClient } from '@/src/core/api/client';
import { BlogPost } from '../../blog/types';
import { Event } from '../../booking/types';
import { Place } from '../../explore/types';

export interface SearchResult {
    type: 'place' | 'event' | 'blog';
    id: string;
    name: string;
    description?: string;
    rating?: number;
    address?: string;
    time?: string;
    data: Place | Event | BlogPost;
}

export interface SearchResponse {
    places: Place[];
    events: Event[];
    blogs: BlogPost[];
}

export const searchService = {
    // Unified search across all content types
    async search(query: string): Promise<SearchResult[]> {
        console.log('[Search] Starting search for:', query);

        const [placesRes, eventsRes, blogsRes] = await Promise.allSettled([
            apiClient.get('/places', { params: { q: query, limit: 5 } }),
            apiClient.get('/events', { params: { q: query, limit: 5 } }),
            apiClient.get('/blog', { params: { q: query, limit: 5 } })
        ]);

        const results: SearchResult[] = [];

        // Check if ALL failed - then throw
        if (placesRes.status === 'rejected' && eventsRes.status === 'rejected' && blogsRes.status === 'rejected') {
            console.error('[Search] All search endpoints failed');
            throw new Error((placesRes.reason?.message) || 'Network Error');
        }

        // Process places
        if (placesRes.status === 'fulfilled' && placesRes.value.data?.data) {
            placesRes.value.data.data.forEach((place: Place) => {
                results.push({
                    type: 'place',
                    id: place.id,
                    name: place.name,
                    description: place.description,
                    rating: place.avgRating,
                    address: place.address,
                    data: place
                });
            });
        }

        // Process events
        if (eventsRes.status === 'fulfilled' && eventsRes.value.data?.data) {
            eventsRes.value.data.data.forEach((event: Event) => {
                results.push({
                    type: 'event',
                    id: event.id,
                    name: event.title,
                    description: event.description,
                    time: event.date,
                    data: event
                });
            });
        }

        // Process blogs
        if (blogsRes.status === 'fulfilled' && blogsRes.value.data?.items) {
            blogsRes.value.data.items.forEach((blog: BlogPost) => {
                results.push({
                    type: 'blog',
                    id: blog.id,
                    name: blog.title,
                    description: blog.body?.substring(0, 150),
                    data: blog
                });
            });
        }

        console.log('[Search] Total results:', results.length);
        return results;
    },

    // Search places only - return in SearchResult format
    async searchPlaces(query: string): Promise<SearchResult[]> {
        console.log('[Search] Searching places only for:', query);
        const response = await apiClient.get('/places', { params: { q: query, limit: 20 } });
        const places = response.data?.data || [];

        return places.map((place: Place) => ({
            type: 'place' as const,
            id: place.id,
            name: place.name,
            description: place.description,
            rating: place.avgRating,
            address: place.address,
            data: place
        }));
    },

    // Search events only - return in SearchResult format
    async searchEvents(query: string): Promise<SearchResult[]> {
        console.log('[Search] Searching events only for:', query);
        const response = await apiClient.get('/events', { params: { q: query, limit: 20 } });
        const events = response.data?.data || [];

        return events.map((event: Event) => ({
            type: 'event' as const,
            id: event.id,
            name: event.title,
            description: event.description,
            time: event.date,
            data: event
        }));
    },

    // Search blog posts only - return in SearchResult format
    async searchBlogs(query: string): Promise<SearchResult[]> {
        console.log('[Search] Searching blogs only for:', query);
        const response = await apiClient.get('/blog', { params: { q: query, limit: 20 } });

        console.log('[Search] Blog API response status:', response.status);
        console.log('[Search] Blog API response data structure:', {
            hasItems: !!response.data?.items,
            itemsCount: response.data?.items?.length || 0,
            total: response.data?.total
        });

        const blogs = response.data?.items || [];
        console.log('[Search] Blog posts found:', blogs.length);

        if (blogs.length === 0) {
            console.warn('[Search] No blog posts returned. Check if posts are APPROVED in database.');
            console.warn('[Search] Full response:', JSON.stringify(response.data, null, 2));
        }

        return blogs.map((blog: BlogPost) => ({
            type: 'blog' as const,
            id: blog.id,
            name: blog.title,
            description: blog.body?.substring(0, 150),
            data: blog
        }));
    },

    // Smart search for blogs with intent detection
    async smartSearchBlogs(query: string): Promise<{
        intent: 'category' | 'list' | 'navigate';
        bestMatch?: BlogPost;
        results: SearchResult[];
        matchedCategory?: string;
    }> {
        try {
            console.log('[Search] Smart searching blogs for:', query);
            const response = await apiClient.get('/blog/search/smart', { params: { q: query } });

            const { intent, bestMatch, results, matchedCategory } = response.data;

            // Transform raw blog posts to SearchResult format
            const searchResults = (results || []).map((blog: BlogPost) => ({
                type: 'blog' as const,
                id: blog.id,
                name: blog.title,
                description: blog.body?.substring(0, 150),
                data: blog
            }));

            return {
                intent: intent || 'list',
                bestMatch,
                results: searchResults,
                matchedCategory
            };
        } catch (error) {
            console.error('[Search] Smart blog search failed:', error);
            throw error; // Propagate error for UI handling
        }
    }
};
