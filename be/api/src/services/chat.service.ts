import { Op } from 'sequelize';
import { ConversationModel } from '@/models/conversations.model';
import { MessageModel } from '../models/messages.model';
import { ChatStatus, ChatType } from '../interfaces/conversation.interface';
import { Status } from '@/interfaces/auth.interface';
import { UserModel } from '../models/users.model';

export class ChatService {
  // Generic Chat Creation
  public static async createGenericConversation(userId: number): Promise<ConversationModel> {
    const existing = await ConversationModel.findOne({
      where: {
        userId,
        type: ChatType.GENERIC,
        status: ChatStatus.ACTIVE,
        expiresAt: { [Op.gt]: new Date() },
      },
    });
    if (existing) return existing;

    const onlineStaff = await UserModel.findOne({
      where: { role: 'STAFF', status: Status.ACTIVE },
      order: [['lastAssignedAt', 'ASC']], // Optional round robin
    });

    if (!onlineStaff) throw new Error('No staff online currently');

    await onlineStaff.update({ lastAssignedAt: new Date() });

    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 2);

    return await ConversationModel.create({
      userId,
      staffId: onlineStaff.id,
      type: ChatType.GENERIC,
      status: ChatStatus.ACTIVE,
      expiresAt: expiration,
    });
  }

  // Order-bound Chat Creation
  public static async createOrderConversation(userId: number, orderId: number): Promise<ConversationModel> {
    const existing = await ConversationModel.findOne({ where: { userId, orderId } });
    if (existing) return existing;

    const staff = await UserModel.findOne({
      where: { role: 'STAFF', status: Status.ACTIVE },
      order: [['lastAssignedAt', 'ASC']],
    });

    if (!staff) throw new Error('No available staff');

    await staff.update({ lastAssignedAt: new Date() });

    return await ConversationModel.create({
      userId,
      staffId: staff.id,
      orderId,
      type: ChatType.ORDERBOUND,
      status: ChatStatus.ACTIVE,
      expiresAt: null, // Will be set after confirmation
    });
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
