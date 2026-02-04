import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCHES_KEY = '@recent_searches';
const MAX_RECENT_SEARCHES = 5;

export const searchHistoryService = {
    // Get recent searches
    async getRecentSearches(): Promise<string[]> {
        try {
            const searches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
            return searches ? JSON.parse(searches) : [];
        } catch (error) {
            console.error('Failed to get recent searches:', error);
            return [];
        }
    },

    // Add a search to history
    async addSearch(query: string): Promise<void> {
        if (!query || query.trim().length === 0) return;

        try {
            const searches = await this.getRecentSearches();

            // Remove if already exists
            const filtered = searches.filter(s => s !== query);

            // Add to beginning
            const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);

            await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to add search:', error);
        }
    },

    // Clear all recent searches
    async clearRecentSearches(): Promise<void> {
        try {
            await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
        } catch (error) {
            console.error('Failed to clear recent searches:', error);
        }
    },
};
