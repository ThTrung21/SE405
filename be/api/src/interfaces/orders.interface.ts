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
  orderPrice: number;

  createdAt?: Date;
  updatedAt?: Date;
}
