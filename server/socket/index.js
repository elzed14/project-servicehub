import { onlineUsers, conversations } from './state.js';
import { handleAuthentication } from './events/authentication.js';
import { handleConversation } from './events/conversation.js';
import { handleMessage } from './events/message.js';
import { handleTyping } from './events/typing.js';
import { handleDisconnect } from './events/disconnect.js';

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Gérer l'authentification
    handleAuthentication(socket, io);

    // Gérer les conversations
    handleConversation(socket, io);

    // Gérer les messages
    handleMessage(socket, io);

    // Gérer les indicateurs de frappe
    handleTyping(socket, io);

    // Gérer la déconnexion
    handleDisconnect(socket, io);
  });
};
