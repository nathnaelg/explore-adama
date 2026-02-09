import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { searchService } from "../services/search.service";

export const useSearch = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchService.search(query),
    enabled: enabled && query.length > 0, // Only search if query is not empty
    staleTime: 30000, // Cache for 30 seconds
  });
};

export const useSearchPlaces = (query: string) => {
  return useQuery({
    queryKey: ["search-places", query],
    queryFn: () => searchService.searchPlaces(query),
    enabled: query.length > 0,
  });
};

export const useSearchEvents = (query: string) => {
  return useQuery({
    queryKey: ["search-events", query],
    queryFn: () => searchService.searchEvents(query),
    enabled: query.length > 0,
  });
};

export const useSearchBlogs = (query: string) => {
  return useQuery({
    queryKey: ["search-blogs", query],
    queryFn: () => searchService.searchBlogs(query),
    enabled: query.length > 0,
  });
};

// Custom hook with debouncing
export const useDebouncedSearch = (query: string, delay: number = 300) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  const searchResults = useSearch(debouncedQuery, debouncedQuery.length > 0);

  return {
    debouncedQuery,
    ...searchResults,
    error: searchResults.error,
    isError: searchResults.isError,
    refetch: searchResults.refetch,
  };
};
