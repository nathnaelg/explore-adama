import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification.service';

export const useNotifications = (page = 1, limit = 20) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['notifications', page],
        queryFn: () => notificationService.getNotifications(page, limit),
        refetchInterval: 5000,
        enabled: !!user,
    });
};

export const useNotificationStats = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['notifications', 'stats'],
        queryFn: () => notificationService.getStats(),
        refetchInterval: 5000,
        enabled: !!user,
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
