import { apiClient } from '@/src/core/api/client';
import {
    ChatSession,
    SendMessageDto,
    SendMessageResponse,
} from '../types';

export const chatService = {
    // List all chat sessions
    async listSessions(): Promise<{ sessions: ChatSession[] }> {
        const response = await apiClient.get('/chat/sessions');
        return response.data;
    },

    // Create new chat session
    async createSession(title?: string): Promise<ChatSession> {
        const response = await apiClient.post('/chat/session', { title });
        return response.data;
    },

    // Get details of a chat session
    async getSessionById(id: string): Promise<ChatSession> {
        const response = await apiClient.get(`/chat/session/${id}`);
        return response.data;
    },

    // Send message to assistant
    async sendMessage(data: SendMessageDto): Promise<SendMessageResponse> {
        const response = await apiClient.post('/chat/message', data);
        return response.data;
    },
};
