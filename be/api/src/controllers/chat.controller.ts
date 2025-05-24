import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/chat.service';

export class ChatController {
  // Create a generic chat (user asks a question)
  public createGenericChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const conversation = await ChatService.createGenericConversation(userId);
      res.status(201).json({ data: conversation, message: 'Generic chat created' });
    } catch (error) {
      next(error);
    }
  };

  // Create an order-bound chat
  public createOrderChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const { orderId } = req.body;
      const conversation = await ChatService.createOrderConversation(userId, orderId);
      res.status(201).json({ data: conversation, message: 'Order chat created' });
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

  // Send a message in a conversation
  public sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId, productId, content } = req.body;
      const senderId = Number(req.params.id);
      const message = await ChatService.saveMessage({ conversationId, senderId, productId, content });
      res.status(201).json({ data: message, message: 'Message sent' });
    } catch (error) {
      next(error);
    }
  };
}
