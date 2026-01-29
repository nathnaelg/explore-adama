// backend/src/config/map.config.ts
import { env } from './env.js';

/**
 * Centralized map configuration for Google Maps integration
 * Used across backend, admin panel, and mobile app
 */

export const mapConfig = {
    // Google Maps API Key from environment
    apiKey: env.GOOGLE_MAPS_API_KEY || '',

    // Default map center (Adama city center, Ethiopia)
    defaultCenter: {
        latitude: 8.5414,
        longitude: 39.2685,
    },

    // Default zoom levels
    zoom: {
        city: 13,
        detail: 15,
        nearby: 12,
    },

    // Map bounds for Adama region (optional, for validation)
    bounds: {
        north: 8.6,
        south: 8.4,
        east: 39.4,
        west: 39.1,
    },
};

/**
 * Validate if coordinates are within reasonable bounds
 */
export function isValidCoordinate(lat: number, lng: number): boolean {
    return (
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180 &&
        !isNaN(lat) &&
        !isNaN(lng)
    );
}

/**
 * Validate if coordinates are within Adama region (loose check)
 */
export function isWithinAdamaRegion(lat: number, lng: number): boolean {
    const { bounds } = mapConfig;
    return (
        lat >= bounds.south &&
        lat <= bounds.north &&
        lng >= bounds.west &&
        lng <= bounds.east
    );
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
}
