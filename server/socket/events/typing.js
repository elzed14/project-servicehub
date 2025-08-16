export const handleTyping = (socket, io) => {
  socket.on('typing_start', (data) => {
    socket.to(data.conversationId).emit('user_typing', {
      userId: socket.userId,
      conversationId: data.conversationId,
    });
  });

  socket.on('typing_stop', (data) => {
    socket.to(data.conversationId).emit('user_stopped_typing', {
      userId: socket.userId,
      conversationId: data.conversationId,
    });
  });
};
