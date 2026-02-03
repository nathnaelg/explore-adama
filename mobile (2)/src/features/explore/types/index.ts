export interface Media {
    id: string;
    url: string;
    type: 'IMAGE' | 'VIDEO';
    caption?: string;
}

export interface Category {
    id: string;
    key: string;
    name: string;
}

export interface Place {
    id: string;
    name: string;
    description?: string;
    categoryId?: string;
    latitude: number;
    longitude: number;
    address?: string;
    viewCount?: number;
    bookingCount?: number;
    avgRating?: number;
    images: Media[];
    createdAt: string;
}

export interface CreatePlaceDto {
    name: string;
    description?: string;
    categoryId?: string;
    latitude: number;
    longitude: number;
    address?: string;
}

export interface PlaceQueryParams {
    page?: number;
    perPage?: number;
    q?: string;
    categoryId?: string;
    sort?: string;
}

export interface NearbyParams {
    lat: number;
    lng: number;
    radius?: number;
}

export interface Interaction {
    id: string;
    type: 'VIEW' | 'CLICK' | 'SAVE' | 'BOOK' | 'REVIEW' | 'SHARE';
    itemId: string;
    itemType: string;
    userId?: string;
    createdAt: string;
}

export interface RecordInteractionDto {
    itemId: string;
    itemType: string;
    type: 'VIEW' | 'CLICK' | 'SAVE' | 'BOOK' | 'REVIEW' | 'SHARE';
    context?: Record<string, any>;
}

export interface Favorite {
    id: string;
    itemId: string;
    itemType: string;
}

export interface AddFavoriteDto {
    itemId: string;
    itemType: 'PLACE' | 'EVENT';
}

export interface GlobalRecommendations {
    popularEvents: any[]; // We can import Event here if needed, but to avoid circularity we might use any or separate
    popularPlaces: Place[];
}
