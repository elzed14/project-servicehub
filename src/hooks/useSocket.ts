import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, OnlineUser } from '../types';

export const useSocket = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    const newSocket = io(process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:3001', {
      auth: {
        userId: userId
      }
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('online_users', (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    newSocket.on('user_joined', (user: OnlineUser) => {
      setOnlineUsers(prev => [...prev.filter(u => u.userId !== user.userId), user]);
    });

    newSocket.on('user_left', (userId: string) => {
      setOnlineUsers(prev => prev.filter(u => u.userId !== userId));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId]);

  const sendMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    if (socket) {
      socket.emit('send_message', message);
    }
  }, [socket]);

  const joinConversation = useCallback((conversationId: string) => {
    if (socket) {
      socket.emit('join_conversation', conversationId);
    }
  }, [socket]);

  const leaveConversation = useCallback((conversationId: string) => {
    if (socket) {
      socket.emit('leave_conversation', conversationId);
    }
  }, [socket]);

  const startTyping = useCallback((conversationId: string) => {
    if (socket) {
      socket.emit('typing_start', conversationId);
    }
  }, [socket]);

  const stopTyping = useCallback((conversationId: string) => {
    if (socket) {
      socket.emit('typing_stop', conversationId);
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    onlineUsers,
    sendMessage,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping
  };
};