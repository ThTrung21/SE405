import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/chat.service';
import { Conversation } from '@/interfaces/conversation.interface';
import Container from 'typedi';

import { logger } from '@/utils/logger';

export class ChatController {
  // Create a generic chat (user asks a question)

  public createGenericChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.body.userId);
      const conversation = await ChatService.createGenericConversation(userId);
      res.status(201).json({ data: conversation, message: 'Generic chat created' });
    } catch (error) {
      next(error);
    }
  };

  public getStaffChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const staffId = Number(req.params.id);
      const getStaffChats: Conversation[] = await ChatService.getStaffChats(staffId);

      res.status(200).json({ data: getStaffChats, message: 'findMany' });
    } catch (error) {
      next(error);
    }
  };
  public getCustomerChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      logger.info(req);
      const getCustomerChat: Conversation = await ChatService.getCustomerChat(userId);

      res.status(200).json({ data: getCustomerChat, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  // Mark a conversation as completed
  public completeOrderChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId } = req.params;
      await ChatService.completeOrderConversation(Number(conversationId));
      res.status(200).json({ message: 'Chat marked as completed and will expire in 24h' });
    } catch (error) {
      next(error);
    }
  };

  // Get messages in a conversation
  public getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId } = req.params;
      const messages = await ChatService.getMessages(Number(conversationId));
      res.status(200).json({ data: messages, message: 'Messages fetched' });
    } catch (error) {
      next(error);
    }
  };
  public getLastMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId, userId } = req.params;

      const messages = await ChatService.getLastMessage(Number(conversationId), Number(userId));
      logger.info('ooga', messages);
      res.status(200).json({ data: messages, message: 'Messages fetched' });
    } catch (error) {
      next(error);
    }
  };
  // Send a message in a conversation
  public sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { senderId, conversationId, productId, content } = req.body;
      // const senderId = Number(req.params.id);
      const message = await ChatService.saveMessage({ conversationId, senderId, productId, content });
      res.status(201).json({ data: message, message: 'Message sent' });
    } catch (error) {
      next(error);
    }
  };
}
