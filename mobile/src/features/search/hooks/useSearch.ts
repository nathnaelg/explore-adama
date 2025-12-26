import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { searchService } from '../services/search.service';

export const useSearch = (query: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['search', query],
        queryFn: () => searchService.search(query),
        enabled: enabled && query.length > 2, // Only search if query is at least 3 characters
        staleTime: 30000, // Cache for 30 seconds
    });
};

export const useSearchPlaces = (query: string) => {
    return useQuery({
        queryKey: ['search-places', query],
        queryFn: () => searchService.searchPlaces(query),
        enabled: query.length > 2,
    });
};

export const useSearchEvents = (query: string) => {
    return useQuery({
        queryKey: ['search-events', query],
        queryFn: () => searchService.searchEvents(query),
        enabled: query.length > 2,
    });
};

export const useSearchBlogs = (query: string) => {
    return useQuery({
        queryKey: ['search-blogs', query],
        queryFn: () => searchService.searchBlogs(query),
        enabled: query.length > 2,
    });
};

// Custom hook with debouncing
export const useDebouncedSearch = (initialQuery: string = '', delay: number = 500) => {
    const [query, setQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, delay);

        return () => clearTimeout(timer);
    }, [query, delay]);

    const searchResults = useSearch(debouncedQuery, debouncedQuery.length > 2);

    return {
        query,
        setQuery,
        debouncedQuery,
        ...searchResults,
    };
};
