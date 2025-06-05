export interface IOrder {
  id: number | string;
  status: string;
  userId: number | string;
  receiptAddress: string;
  receiptName: string;
  receiptPhone: string;
  orderPrice: number;
  address: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
  OrderItemModels: OrderItemModel[];
}

export interface OrderItemModel {
  id: number | string;
  quantity: number;
  productId: number | string;
  orderId: number;
  sumPrice: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
