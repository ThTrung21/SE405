import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ValidationMiddleware } from '../middlewares/validation.middleware';

import { SendMessageDto } from '@/dtos/messages.dto';
import { CreateConversationDto } from '@/dtos/conversations.dto';
export class ChatRoute {
  public path = '/chats';
  public router = Router();
  public chatController = new ChatController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/generic`, AuthMiddleware, ValidationMiddleware(CreateConversationDto), this.chatController.createGenericChat);

    this.router.post(`${this.path}/order`, AuthMiddleware, ValidationMiddleware(CreateConversationDto), this.chatController.createOrderChat);

    this.router.post(`${this.path}/:conversationId/complete`, AuthMiddleware, this.chatController.completeOrderChat);

    this.router.get(`${this.path}/:conversationId/messages`, AuthMiddleware, this.chatController.getMessages);

    this.router.post(`${this.path}/message`, AuthMiddleware, ValidationMiddleware(SendMessageDto), this.chatController.sendMessage);
  }
}
