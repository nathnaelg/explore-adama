import { useQuery } from '@tanstack/react-query';
import { exploreService } from '../services/explore.service';
import { recommendationService } from '../services/recommendation.service';
import { NearbyParams, PlaceQueryParams } from '../types';

export const usePlaces = (params: PlaceQueryParams = {}) => {
    return useQuery({
        queryKey: ['places', params],
        queryFn: () => exploreService.listPlaces(params),
        refetchInterval: 1000,
    });
};

export const usePlace = (id: string) => {
    return useQuery({
        queryKey: ['place', id],
        queryFn: () => exploreService.getPlaceById(id),
        enabled: !!id,
        refetchInterval: 1000,
    });
};

export const useNearbyPlaces = (params: NearbyParams) => {
    return useQuery({
        queryKey: ['places', 'nearby', params],
        queryFn: () => exploreService.getNearbyPlaces(params),
        enabled: !!params.lat && !!params.lng,
        refetchInterval: 1000,
    });
};

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => exploreService.listCategories(),
        refetchInterval: 1000,
    });
};

export const useGlobalRecommendations = () => {
    return useQuery({
        queryKey: ['recommendations', 'global'],
        queryFn: () => recommendationService.getGlobalRecommendations(),
        refetchInterval: 1000,
    });
};
