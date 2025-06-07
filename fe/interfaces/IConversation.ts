export interface IConversation {
  id: number | string;
  staffId?: number | string;
  orderId?: number | string | null;
  type: string;
  status: string;
  expiresAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
