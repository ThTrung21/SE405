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
    this.router.post(`${this.path}/generic`, AuthMiddleware, this.chatController.createGenericChat);
    //get customer's chat
    this.router.get(`${this.path}/conversation/:id(\\d+)`, this.chatController.getCustomerChat);

    this.router.get(`${this.path}/staffconversation/:id(\\d+)`, this.chatController.getStaffChat);

    this.router.get(`${this.path}/:conversationId/messages`, AuthMiddleware, this.chatController.getMessages);
    this.router.get(`${this.path}/:conversationId/:userId/lastmessages`, AuthMiddleware, this.chatController.getLastMessage);
    this.router.post(`${this.path}/message`, AuthMiddleware, ValidationMiddleware(SendMessageDto), this.chatController.sendMessage);
  }
}
