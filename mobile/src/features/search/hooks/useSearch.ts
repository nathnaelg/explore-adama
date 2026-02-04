import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { searchService } from '../services/search.service';

export const useSearch = (query: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['search', query],
        queryFn: () => searchService.search(query),
        enabled: enabled && query.length > 0, // Only search if query is not empty
        staleTime: 30000, // Cache for 30 seconds
    });
};

export const useSearchPlaces = (query: string) => {
    return useQuery({
        queryKey: ['search-places', query],
        queryFn: () => searchService.searchPlaces(query),
        enabled: query.length > 0,
    });
};

export const useSearchEvents = (query: string) => {
    return useQuery({
        queryKey: ['search-events', query],
        queryFn: () => searchService.searchEvents(query),
        enabled: query.length > 0,
    });
};

export const useSearchBlogs = (query: string) => {
    return useQuery({
        queryKey: ['search-blogs', query],
        queryFn: () => searchService.searchBlogs(query),
        enabled: query.length > 0,
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

    const searchResults = useSearch(debouncedQuery, debouncedQuery.length > 0);

    return {
        query,
        setQuery,
        debouncedQuery,
        ...searchResults,
    };
};

// Smart blog search hook
export const useSmartBlogSearch = (query: string) => {
    return useQuery({
        queryKey: ['search-blogs-smart', query],
        queryFn: () => searchService.smartSearchBlogs(query),
        enabled: query.length > 0,
    });
};

export const useDebouncedSearchWithType = (initialQuery: string = '', type: 'all' | 'place' | 'event' | 'blog' = 'all', delay: number = 500) => {
    const [query, setQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, delay);

        return () => clearTimeout(timer);
    }, [query, delay]);

    // Conditional hooks based on type
    const searchAll = useSearch(debouncedQuery, type === 'all' && debouncedQuery.length > 0);
    const searchPlaces = useSearchPlaces(type === 'place' && debouncedQuery.length > 0 ? debouncedQuery : '');
    const searchEvents = useSearchEvents(type === 'event' && debouncedQuery.length > 0 ? debouncedQuery : '');
    const searchBlogs = useSmartBlogSearch(type === 'blog' && debouncedQuery.length > 0 ? debouncedQuery : '');

    // Normalize return data
    let result = searchAll;
    if (type === 'place') result = searchPlaces;
    else if (type === 'event') result = searchEvents;
    else if (type === 'blog') {
        // Adapt smart search result to standard result for the UI
        result = {
            ...searchBlogs,
            data: searchBlogs.data?.results || []
        } as any;
    }

    // Expose raw smart search data for the UI to use intent
    const smartSearchData = type === 'blog' ? searchBlogs.data : undefined;

    return {
        query,
        setQuery,
        debouncedQuery,
        ...result,
        smartSearchData // New field for smart capabilities
    };
};
