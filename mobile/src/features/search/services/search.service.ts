import { apiClient } from "@/src/core/api/client";
import { BlogPost } from "../../blog/types";
import { Event } from "../../booking/types";
import { Place } from "../../explore/types";

export interface SearchResult {
  type: "place" | "event" | "blog";
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
    try {
      const results: SearchResult[] = [];
      const errors: any[] = [];

      const [placesRes, eventsRes, blogsRes] = await Promise.allSettled([
        apiClient.get("/places", { params: { q: query, limit: 5 } }),
        apiClient.get("/events", { params: { q: query, limit: 5 } }),
        apiClient.get("/blog", { params: { q: query, limit: 5 } }),
      ]);

      // Helper to process results or collect errors
      const processResult = (res: PromiseSettledResult<any>, type: string) => {
        if (res.status === "rejected") {
          console.warn(`Search for ${type} failed:`, res.reason);
          errors.push(res.reason);
          return null;
        }
        return res.value;
      };

      const placesData = processResult(placesRes, "places");
      const eventsData = processResult(eventsRes, "events");
      const blogsData = processResult(blogsRes, "blogs");

      // If ALL requests failed, throw an error to be handled by the UI
      if (errors.length === 3) {
        throw new Error("All search services failed");
      }

      // Process places
      if (placesData?.data?.data) {
        placesData.data.data.forEach((place: Place) => {
          results.push({
            type: "place",
            id: place.id,
            name: place.name,
            description: place.description,
            rating: place.avgRating,
            address: place.address,
            data: place,
          });
        });
      }

      // Process events
      if (eventsData?.data?.data) {
        eventsData.data.data.forEach((event: Event) => {
          results.push({
            type: "event",
            id: event.id,
            name: event.title,
            description: event.description,
            time: event.date,
            data: event,
          });
        });
      }

      // Process blogs
      if (blogsData?.data?.items) {
        blogsData.data.items.forEach((blog: BlogPost) => {
          results.push({
            type: "blog",
            id: blog.id,
            name: blog.title,
            description: blog.body?.substring(0, 150),
            data: blog,
          });
        });
      }

      return results;
    } catch (error) {
      console.error("Search failed:", error);
      throw error; // Re-throw to be handled by react-query
    }
  },

  // Search places only
  async searchPlaces(query: string): Promise<Place[]> {
    const response = await apiClient.get("/places", { params: { q: query } });
    return response.data?.data || [];
  },

  // Search events only
  async searchEvents(query: string): Promise<Event[]> {
    const response = await apiClient.get("/events", { params: { q: query } });
    return response.data?.data || [];
  },

  // Search blog posts only
  async searchBlogs(query: string): Promise<BlogPost[]> {
    const response = await apiClient.get("/blog", { params: { q: query } });
    return response.data?.items || [];
  },
};
