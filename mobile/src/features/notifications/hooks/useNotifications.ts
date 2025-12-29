import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification.service';

export const useNotifications = (page = 1, limit = 20) => {
    return useQuery({
        queryKey: ['notifications', page],
        queryFn: () => notificationService.getNotifications(page, limit),
        refetchInterval: 1000, // Poll every second
    });
};

export const useNotificationStats = () => {
    return useQuery({
        queryKey: ['notifications', 'stats'],
        queryFn: () => notificationService.getStats(),
        refetchInterval: 1000, // Poll every second for badge updates
    });
};

export const useMarkNotificationRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => notificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useMarkAllNotificationsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => notificationService.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};
