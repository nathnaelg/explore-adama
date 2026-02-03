export interface ChatMessage {
    id: string;
    role: 'USER' | 'ASSISTANT' | 'SYSTEM' | 'user' | 'assistant';
    content: string;
    createdAt: string;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
}

export interface SendMessageDto {
    sessionId?: string;
    message: string;
    language?: string;
    meta?: Record<string, any>;
}

export interface SendMessageResponse {
    sessionId: string;
    response: string;
    message: ChatMessage;
}
