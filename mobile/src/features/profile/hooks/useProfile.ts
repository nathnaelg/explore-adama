import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import { UpdateProfileDto } from '../types';

export const useProfile = (userId?: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['profile', userId],
        queryFn: () => profileService.getCurrentUser(userId),
        enabled: enabled && !!userId, // Only run if enabled AND userId exists
        retry: 1, // Only retry once for profile to avoid flooding if 403
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileDto) => profileService.updateProfile(data),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['profile'], updatedUser);
        },
    });
};

export const useUsers = (page: number = 1, perPage: number = 10) => {
    return useQuery({
        queryKey: ['users', { page, perPage }],
        queryFn: () => profileService.listUsers(page, perPage),
    });
};

export const useUserStats = () => {
    return useQuery({
        queryKey: ['user-stats'],
        queryFn: () => profileService.getUserStats(),
        staleTime: 30000, // Cache for 30 seconds
    });
};
