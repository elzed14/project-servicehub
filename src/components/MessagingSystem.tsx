import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  X,
  Circle,
  CheckCheck,
  Clock,
  Loader2
} from 'lucide-react';
import { Message, Conversation, User } from '../types';
import { useSocket } from '../hooks/useSocket';
import { messageService } from '../services/messageService';

interface MessagingSystemProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  initialConversationId?: string;
}

export default function MessagingSystem({ 
  currentUser, 
  isOpen, 
  onClose, 
  initialConversationId 
}: MessagingSystemProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    initialConversationId || null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { socket, isConnected, onlineUsers, sendMessage, joinConversation, leaveConversation } = 
    useSocket(currentUser.id);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await messageService.getConversations();
        setConversations(response.data);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      }
    };
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation) {
        setLoading(true);
        try {
          const response = await messageService.getMessages(selectedConversation);
          setMessages(response.data);
          joinConversation(selectedConversation);
        } catch (error) {
          console.error("Failed to fetch messages", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMessages();
  }, [selectedConversation, joinConversation]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', (message: Message) => {
      if (message.conversationId === selectedConversation) {
        setMessages(prev => [...prev, message]);
      }
      
      // Update conversation list
      setConversations(prev => prev.map(conv => 
        conv.id === message.conversationId 
          ? { 
              ...conv, 
              lastMessage: message, 
              unreadCount: message.senderId !== currentUser.id ? conv.unreadCount + 1 : conv.unreadCount,
              updatedAt: message.timestamp 
            }
          : conv
      ));
    });

    socket.on('message_read', (messageId: string) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
    });

    return () => {
      socket.off('new_message');
      socket.off('message_read');
    };
  }, [socket, selectedConversation, currentUser.id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const receiverId = conversations.find(c => c.id === selectedConversation)?.participants
      .find(p => p.id !== currentUser.id)?.id || '';

    const message: Omit<Message, 'id' | 'timestamp' | 'receiverId'> & { receiverId: string } = {
      conversationId: selectedConversation,
      senderId: currentUser.id,
      receiverId: receiverId,
      content: newMessage.trim(),
      isRead: false,
      type: 'text'
    };

    sendMessage(message);
    
    try {
      const response = await messageService.sendMessage(selectedConversation, newMessage.trim());
      // Add to local state immediately for better UX, then update with server response
      setMessages(prev => [...prev.filter(m => m.id !== 'temp'), response.data]);
    } catch (error) {
      console.error("Failed to send message", error);
      // Handle failed message, e.g., show an error icon
    }

    setNewMessage('');
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.id !== currentUser.id);
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.some(user => user.userId === userId);
  };

  const filteredConversations = conversations.filter(conv => {
    const otherUser = getOtherParticipant(conv);
    return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[80vh] flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => {
              const otherUser = getOtherParticipant(conversation);
              if (!otherUser) return null;

              return (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 ${
                    selectedConversation === conversation.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {isUserOnline(otherUser.id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {otherUser.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessage?.timestamp.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage?.content}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                            {conversation.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Connection Status */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm">
              <Circle className={`w-2 h-2 ${isConnected ? 'text-green-500 fill-current' : 'text-red-500 fill-current'}`} />
              <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                {isConnected ? 'En ligne' : 'Hors ligne'}
              </span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const conversation = conversations.find(c => c.id === selectedConversation);
                      const otherUser = conversation ? getOtherParticipant(conversation) : null;
                      if (!otherUser) return null;

                      return (
                        <>
                          <div className="relative">
                            <img
                              src={otherUser.avatar}
                              alt={otherUser.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            {isUserOnline(otherUser.id) && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{otherUser.name}</h3>
                            <p className="text-xs text-gray-500">
                              {isUserOnline(otherUser.id) ? 'En ligne' : 'Hors ligne'}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwn = message.senderId === currentUser.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-end space-x-1 mt-1 ${
                            isOwn ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">
                              {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {isOwn && (
                              message.isRead ? (
                                <CheckCheck className="w-3 h-3" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Tapez votre message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez une conversation
                </h3>
                <p className="text-gray-500">
                  Choisissez une conversation pour commencer à discuter
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
