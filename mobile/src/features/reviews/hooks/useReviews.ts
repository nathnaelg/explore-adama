import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { CreateReviewDto, ReviewQueryParams } from '../types';

export const useReviews = (params: Partial<ReviewQueryParams> = {}) => {
    return useQuery({
        queryKey: ['reviews', params],
        queryFn: () => reviewService.listReviews(params as ReviewQueryParams),
        enabled: !!params.itemType && !!params.itemId,
    });
};

export const useReview = (id: string) => {
    return useQuery({
        queryKey: ['review', id],
        queryFn: () => reviewService.getReviewById(id),
        enabled: !!id,
    });
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateReviewDto) => reviewService.createReview(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
        },
    });
};

export const useUpdateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: { rating?: number, comment?: string } }) =>
            reviewService.updateReview(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            queryClient.invalidateQueries({ queryKey: ['review', variables.id] });
        },
    });
};

export const useDeleteReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => reviewService.deleteReview(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
        },
    });
};
