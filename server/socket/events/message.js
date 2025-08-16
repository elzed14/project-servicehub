export const handleMessage = (socket, io) => {
  socket.on('send_message', (message) => {
    console.log('Message received:', message);

    // Diffuser le message aux participants de la conversation
    socket.to(message.conversationId).emit('new_message', message);

    // Renvoyer également à l'expéditeur pour confirmation
    socket.emit('message_sent', message);
  });

  socket.on('mark_message_read', (data) => {
    socket.to(data.conversationId).emit('message_read', data);
  });
};
