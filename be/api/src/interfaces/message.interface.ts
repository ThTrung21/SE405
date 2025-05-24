export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  productId?: number; //for product attached message
  createdAt?: Date;
  content: string;
}
