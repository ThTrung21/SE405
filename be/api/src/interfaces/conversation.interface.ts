export enum ChatType {
  GENERIC = 'GENERIC',
  ORDERBOUND = 'ORDERBOUND',
}
export enum ChatStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
}

export interface Conversation {
  id: number;

  userId: number;
  staffId?: number;

  orderId?: number;

  type: ChatType;
  status: ChatStatus;

  createdAt?: Date;
  updatedAt?: Date;
  expiresAt: Date;
}
