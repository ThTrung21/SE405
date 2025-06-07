export interface IMessage {
  id: string | number;
  conversationId: string | number;
  senderId: string | number;
  productId?: string | number;
  content: string;
  createdAt: Date | string;
}
