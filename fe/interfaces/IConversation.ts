export interface IConversation {
  id: number | string;
  userId: number;
  staffId?: number | string;
  orderId?: number | string | null;
  type: string;
  status: string;
  expiresAt?: null | string;
  createdAt: null | string;
  updatedAt: null | string;
  deletedAt: string | null;
}
