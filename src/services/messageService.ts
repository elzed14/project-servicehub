import api from './api';
import { Message, Conversation } from '../types';

export const messageService = {
  getConversations: () => api.get<Conversation[]>('/messages/conversations'),
  
  getMessages: (conversationId: string) => 
    api.get<Message[]>(`/messages/${conversationId}`),
  
  sendMessage: (conversationId: string, content: string) => 
    api.post<Message>(`/messages/${conversationId}`, { content }),

  createConversation: (userId: string, serviceId?: string) =>
    api.post<Conversation>('/messages/conversations', { userId, serviceId }),
};
