import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chat.service';
import { SendMessageResponse } from '../types';

export const useChatSession = (sessionId?: string) => {
    return useQuery({
        queryKey: ['chat-session', sessionId],
        queryFn: () => chatService.getSessionById(sessionId!),
        enabled: !!sessionId,
    });
};

export const useChatMessages = (sessionId?: string) => {
    return useQuery({
        queryKey: ['chat-messages', sessionId],
        queryFn: () => chatService.getSessionById(sessionId!),
        enabled: !!sessionId,
        select: (data) => data.messages || [],
    });
};

export const useChatSessions = () => {
    return useQuery({
        queryKey: ['chat-sessions'],
        queryFn: () => chatService.listSessions(),
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation<SendMessageResponse, Error, { sessionId?: string; message: string }>({
        mutationFn: async ({ sessionId, message }) => {
            let activeSessionId = sessionId;

            // If no session ID, explicitly create one first to avoid backend FK error
            if (!activeSessionId) {
                const session = await chatService.createSession('New Chat');
                activeSessionId = session.id;
            }

            return chatService.sendMessage({ sessionId: activeSessionId, message });
        },
        onSuccess: (data) => {
            // Invalidate messages to refetch
            queryClient.invalidateQueries({ queryKey: ['chat-messages', data.sessionId] });
        },
    });
};
