export const handleConversation = (socket, io) => {
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.userId} joined conversation ${conversationId}`);
  });

  socket.on('leave_conversation', (conversationId) => {
    socket.leave(conversationId);
    console.log(`User ${socket.userId} left conversation ${conversationId}`);
  });
};
