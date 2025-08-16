import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile } from 'lucide-react';
import { messagingService, Conversation, Message } from '../../shared/services/messagingService';
import { ModernButton } from '../../shared/components/ui/ModernButton';
import { useSearchParams } from 'react-router-dom';

export const MessagingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const expertId = searchParams.get('expertId');
    if (expertId && conversations.length > 0) {
      const conversation = conversations.find(c => c.participants.some(p => p._id === expertId));
      if (conversation) {
        setSelectedConversation(conversation);
      } else {
        // Si aucune conversation n'existe, on pourrait en créer une ici
        // Pour la démo, on sélectionne la première conversation
        if (conversations.length > 0) {
          setSelectedConversation(conversations[0]);
        }
      }
    }
  }, [searchParams, conversations]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const { conversations: convs } = await messagingService.getConversations();
      
      // Données de démonstration si pas de conversations
      if (convs.length === 0) {
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
              content: 'Bonjour ! J\'ai bien reçu votre demande de devis pour le site web. Je peux vous proposer un rendez-vous cette semaine.',
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
              content: 'Merci pour votre travail excellent !',
              type: 'text',
              createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            unreadCount: 0,
            updatedAt: new Date(Date.now() - 3600000).toISOString()
          }
        ];
        setConversations(mockConversations);
      } else {
        setConversations(convs);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { messages: msgs } = await messagingService.getMessages(conversationId);
      
      // Messages de démonstration
      if (msgs.length === 0) {
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
        setMessages(mockMessages);
      } else {
        setMessages(msgs);
      }

      // Marquer comme lu
      await messagingService.markAsRead(conversationId);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);
    const otherParticipant = selectedConversation.participants[0];

    try {
      const result = await messagingService.sendMessage(otherParticipant._id, newMessage);
      
      if (result.success && result.message) {
        setMessages(prev => [...prev, result.message!]);
        setNewMessage('');
      } else {
        // Simulation pour la démo
        const mockMessage: Message = {
          _id: `msg_${Date.now()}`,
          conversationId: selectedConversation._id,
          senderId: 'user1',
          receiverId: otherParticipant._id,
          content: newMessage,
          type: 'text',
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, mockMessage]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-screen">
          {/* Liste des conversations */}
          <div className="w-1/3 bg-white border-r border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher une conversation..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="overflow-y-auto h-full">
              {conversations.map((conversation) => {
                const otherParticipant = conversation.participants[0];
                const isSelected = selectedConversation?._id === conversation._id;
                
                return (
                  <motion.div
                    key={conversation._id}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 cursor-pointer border-b border-gray-100 ${
                      isSelected ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={otherParticipant.avatar}
                          alt={otherParticipant.name}
                          className="w-12 h-12 rounded-full"
                        />
                        {conversation.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">
                            {otherParticipant.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.updatedAt)}
                          </span>
                        </div>
                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Zone de chat */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header du chat */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedConversation.participants[0].avatar}
                        alt={selectedConversation.participants[0].name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {selectedConversation.participants[0].name}
                        </h2>
                        <p className="text-sm text-green-600">En ligne</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.senderId === 'user1';
                    
                    return (
                      <motion.div
                        key={message._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          isOwn 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-900'
                        }`}>
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isOwn ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Zone de saisie */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Tapez votre message..."
                        className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <ModernButton
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSending}
                      className="rounded-full p-2"
                    >
                      <Send className="w-5 h-5" />
                    </ModernButton>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Sélectionnez une conversation
                  </h2>
                  <p className="text-gray-600">
                    Choisissez une conversation pour commencer à discuter
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};