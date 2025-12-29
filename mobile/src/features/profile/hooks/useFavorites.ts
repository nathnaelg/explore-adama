import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../services/favorite.service';

export const useFavorites = () => {
    return useQuery({
        queryKey: ['favorites'],
        queryFn: () => favoriteService.getFavorites(),
        refetchInterval: 1000,
    });
};

export const useToggleFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ itemId, itemType, isFavorite }: { itemId: string, itemType: 'PLACE' | 'EVENT', isFavorite: boolean }) => {
            if (isFavorite) {
                await favoriteService.removeFavorite(itemId, itemType);
            } else {
                await favoriteService.addFavorite(itemId, itemType);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            // Also invalidate places to update their UI if needed
            queryClient.invalidateQueries({ queryKey: ['places'] });
            // Invalidate user stats to update the favorite count on profile screen
            queryClient.invalidateQueries({ queryKey: ['user-stats'] });
        },
    });
};
