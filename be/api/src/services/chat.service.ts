/* eslint-disable prettier/prettier */
import { Op } from 'sequelize';
import { ConversationModel } from '@/models/conversations.model';
import { MessageModel } from '../models/messages.model';
import { ChatStatus, ChatType, Conversation } from '../interfaces/conversation.interface';
import { Status } from '@/interfaces/auth.interface';
import { UserModel } from '../models/users.model';
import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';

export class ChatService {
  // Generic Chat Creation
  public static async createGenericConversation(userId: number): Promise<ConversationModel> {
    const existing = await ConversationModel.findOne({
      where: {
        userId,
        type: ChatType.GENERIC,
        status: ChatStatus.ACTIVE,
      },
    });
    if (existing) return existing;

    return await ConversationModel.create({
      userId,
      type: ChatType.GENERIC,
      status: ChatStatus.ACTIVE,
    });
  }

  public static async findAllChats(): Promise<Conversation[]> {
      const products = await DB.Conversation.findAll({
          attributes: {
            // exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            include: [],
          },
        });
        return products;
    }

  //get chats for staff: staff is part of conversation or chat where chatid=null
  public static async getStaffChats(_userId: number): Promise<ConversationModel[]> {
    let findChat;
    if (_userId != null)
      findChat = await DB.Conversation.findAll({
        where: {
          [Op.or]: [
            { userId: { [Op.ne]: _userId } }, // userId should not be equal to _userId
            { staffId: _userId }, // staffId should be equal to _userId
            { staffId: { [Op.is]: null } }, // staffId should be null
          ],
        },
      });
    else findChat = await DB.Conversation.findAll();
    console.log(_userId);
    if (!findChat) throw new HttpException(409, "No conversation doesn't exist");

    return findChat;
  }
  //get customer's chat
  public static async getCustomerChat(_userId: number): Promise<ConversationModel> {
    const findChat: ConversationModel = await DB.Conversation.findOne({
      where: {
        userId: _userId,
      },
    });
    console.log(_userId);
    if (!findChat) throw new HttpException(409, "No conversation doesn't exist");

    return findChat;
  }

  // Expire a conversation manually
  public static async expireConversation(conversationId: number): Promise<void> {
    await ConversationModel.update({ status: ChatStatus.EXPIRED }, { where: { id: conversationId } });
  }

  // Mark a conversation completed and set expiration
  public static async completeOrderConversation(conversationId: number): Promise<void> {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 24);
    await ConversationModel.update({ status: ChatStatus.COMPLETED, expiresAt: expiration }, { where: { id: conversationId } });
  }

  // Save a message to a conversation
  public static async saveMessage(data: { conversationId: number; senderId: number; productId?: number; content: string }): Promise<MessageModel> {
    return await MessageModel.create({
      conversationId: data.conversationId,
      senderId: data.senderId,
      productId: data.productId,
      content: data.content,
    });
  }

  // Get all messages in a conversation
  public static async getMessages(conversationId: number): Promise<MessageModel[]> {
    return await MessageModel.findAll({
      where: { conversationId },
      order: [['createdAt', 'ASC']],
    });
  }
  public static async getLastMessage(_conversationId: number, _userId: number): Promise<MessageModel | null> {
    return await MessageModel.findOne({
      where: {
        conversationId: _conversationId,
        senderId: _userId, // Only messages sent by this user
      },
      order: [['createdAt', 'DESC']], // Latest message first
    });
  }

  // Get conversation by ID
  public static async getConversation(id: number): Promise<ConversationModel | null> {
    return await ConversationModel.findByPk(id);
  }

  // Check and expire conversations that are past expiresAt
  public static async expireOldConversations(): Promise<void> {
    await ConversationModel.update(
      { status: ChatStatus.EXPIRED },
      {
        where: {
          status: ChatStatus.ACTIVE,
          expiresAt: { [Op.lt]: new Date() },
        },
      },
    );
  }
}
