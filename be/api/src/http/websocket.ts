import { Server, Socket } from 'socket.io';
import { ChatService } from '../services/chat.service';
import { validateChatMessage } from '../dtos/chat.dto';

export const initSocketServer = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
    });

    socket.on('chatMessage', async msg => {
      try {
        const valid = validateChatMessage(msg); // Your DTO validator
        const saved = await ChatService.handleMessage(valid);
        io.to(msg.roomId).emit('chatMessage', saved);
      } catch (error) {
        socket.emit('errorMessage', { error: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
