import { onlineUsers } from '../state.js';

export const handleDisconnect = (socket, io) => {
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    if (socket.userId) {
      onlineUsers.delete(socket.userId);

      // Diffuser la liste des utilisateurs en ligne mise à jour
      io.emit('users_online', Array.from(onlineUsers.values()));

      // Notifier les autres qu'un utilisateur est parti
      socket.broadcast.emit('user_left', socket.userId);
    }
  });
};
