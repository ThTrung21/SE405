import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { MessageModel } from '../models/messages.model';

interface AuthenticatedSocket extends Socket {
  user?: { id: number };
}

export const initWebSocket = (server: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication token required'));

    try {
      const decoded = verify(token, process.env.JWT_SECRET as string);
      socket.user = decoded as { id: number };
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.user?.id} connected`);

    socket.on('joinConversation', (conversationId: number) => {
      socket.join(`conversation-${conversationId}`);
    });

    socket.on('sendMessage', async data => {
      const { conversationId, productId, content } = data;
      const senderId = socket.user?.id;

      const message = await MessageModel.create({ conversationId, productId, senderId, content });

      io.to(`conversation-${conversationId}`).emit('newMessage', {
        ...message.toJSON(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.user?.id} disconnected`);
    });
  });

  return io;
};
