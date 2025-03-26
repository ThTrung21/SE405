export enum OrderStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
}

export interface Order {
  id?: number;
  status: OrderStatus;
  userId: number;
  receiptAddress: string;
  receiptName: string;
  receiptPhone: string;

  createdAt?: Date;
  updatedAt?: Date;
}
