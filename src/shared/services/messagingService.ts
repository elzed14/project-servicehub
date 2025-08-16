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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Données de démonstration
      const mockConversations: Conversation[] = [
        {
          _id: '1',
          participants: [
            {
              _id: 'expert1',
              name: 'Marie Kouassi',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60'
            }
          ],
          lastMessage: {
            _id: 'msg1',
            conversationId: '1',
            senderId: 'expert1',
            receiverId: 'user1',
            content: 'Bonjour ! J\'ai bien reçu votre demande de devis pour le site web.',
            type: 'text',
            createdAt: new Date().toISOString()
          },
          unreadCount: 2,
          updatedAt: new Date().toISOString()
        },
        {
          _id: '2',
          participants: [
            {
              _id: 'expert2',
              name: 'Jean-Baptiste Ouattara',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60'
            }
          ],
          lastMessage: {
            _id: 'msg2',
            conversationId: '2',
            senderId: 'user1',
            receiverId: 'expert2',
            content: 'Merci pour votre excellent travail !',
            type: 'text',
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          unreadCount: 0,
          updatedAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      return { conversations: mockConversations, total: mockConversations.length };
    } catch (error) {
      console.error('Get conversations error:', error);
      return { conversations: [], total: 0 };
    }
  }

  // Obtenir les messages d'une conversation
  async getMessages(conversationId: string, page = 1, limit = 50): Promise<{ messages: Message[], total: number }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Messages de démonstration
      const mockMessages: Message[] = [
        {
          _id: 'msg1',
          conversationId,
          senderId: 'expert1',
          receiverId: 'user1',
          content: 'Bonjour ! J\'ai bien reçu votre demande de devis pour le site web.',
          type: 'text',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          _id: 'msg2',
          conversationId,
          senderId: 'expert1',
          receiverId: 'user1',
          content: 'Je peux vous proposer un rendez-vous cette semaine pour discuter de vos besoins en détail.',
          type: 'text',
          createdAt: new Date(Date.now() - 7100000).toISOString()
        },
        {
          _id: 'msg3',
          conversationId,
          senderId: 'user1',
          receiverId: 'expert1',
          content: 'Parfait ! Je suis disponible jeudi après-midi. Quel serait votre tarif pour un site e-commerce ?',
          type: 'text',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          _id: 'msg4',
          conversationId,
          senderId: 'expert1',
          receiverId: 'user1',
          content: 'Pour un site e-commerce complet, je propose 250 000 FCFA. Cela inclut le design, le développement et la formation.',
          type: 'text',
          createdAt: new Date().toISOString()
        }
      ];

      return { messages: mockMessages, total: mockMessages.length };
    } catch (error) {
      console.error('Get messages error:', error);
      return { messages: [], total: 0 };
    }
  }

  // Envoyer un message
  async sendMessage(receiverId: string, content: string, type: Message['type'] = 'text'): Promise<{ success: boolean; message?: Message; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newMessage: Message = {
        _id: `msg_${Date.now()}`,
        conversationId: '1',
        senderId: 'user1',
        receiverId,
        content,
        type,
        createdAt: new Date().toISOString()
      };

      return { success: true, message: newMessage };
    } catch (error) {
      console.error('Send message error:', error);
      return { success: false, error: 'Erreur lors de l\'envoi du message' };
    }
  }

  // Marquer les messages comme lus
  async markAsRead(conversationId: string): Promise<{ success: boolean }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return { success: true };
    } catch (error) {
      console.error('Mark as read error:', error);
      return { success: false };
    }
  }

  // Créer ou obtenir une conversation avec un utilisateur
  async getOrCreateConversation(userId: string): Promise<{ success: boolean; conversation?: Conversation; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const conversation: Conversation = {
        _id: `conv_${Date.now()}`,
        participants: [
          {
            _id: userId,
            name: 'Expert',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60'
          }
        ],
        unreadCount: 0,
        updatedAt: new Date().toISOString()
      };

      return { success: true, conversation };
    } catch (error) {
      console.error('Get or create conversation error:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  }
}

export const messagingService = new MessagingService();
export type { Message, Conversation };