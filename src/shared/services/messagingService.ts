// Service de messagerie
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  readAt?: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: {
    _id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

class MessagingService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('servicehub_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Obtenir les conversations de l'utilisateur
  async getConversations(): Promise<{ conversations: Conversation[], total: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      return result.success ? { conversations: result.data, total: result.total } : { conversations: [], total: 0 };
    } catch (error) {
      console.error('Get conversations error:', error);
      return { conversations: [], total: 0 };
    }
  }

  // Obtenir les messages d'une conversation
  async getMessages(conversationId: string, page = 1, limit = 50): Promise<{ messages: Message[], total: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${conversationId}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      return result.success ? { messages: result.data, total: result.total } : { messages: [], total: 0 };
    } catch (error) {
      console.error('Get messages error:', error);
      return { messages: [], total: 0 };
    }
  }

  // Envoyer un message
  async sendMessage(receiverId: string, content: string, type: Message['type'] = 'text'): Promise<{ success: boolean; message?: Message; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/send`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ receiverId, content, type }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Send message error:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  }

  // Marquer les messages comme lus
  async markAsRead(conversationId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${conversationId}/read`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Mark as read error:', error);
      return { success: false };
    }
  }

  // Créer ou obtenir une conversation avec un utilisateur
  async getOrCreateConversation(userId: string): Promise<{ success: boolean; conversation?: Conversation; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversation/${userId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get or create conversation error:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  }
}

export const messagingService = new MessagingService();
export type { Message, Conversation };