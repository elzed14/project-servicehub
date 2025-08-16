import jwt from 'jsonwebtoken';
import { onlineUsers } from '../state.js';

export const handleAuthentication = (socket, io) => {
  socket.on('authenticate', (token) => {
    if (!token) {
      console.error('Aucun token fourni pour l\'authentification');
      socket.disconnect(true);
      return;
    }

    try {
      // Vérifier et décoder le token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      // Stocker l'ID de l'utilisateur dans le socket
      socket.userId = userId;
      onlineUsers.set(userId, {
        userId,
        socketId: socket.id,
        lastSeen: new Date(),
      });

      // Diffuser la liste des utilisateurs en ligne mise à jour
      io.emit('users_online', Array.from(onlineUsers.values()));

      // Notifier les autres qu'un utilisateur a rejoint
      socket.broadcast.emit('user_joined', {
        userId,
        socketId: socket.id,
        lastSeen: new Date(),
      });
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error.message);
      socket.disconnect(true);
    }
  });
};
