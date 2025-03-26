export interface OrderItem {
  id?: number;
  quantity: number;
  orderId: number;
  productId: number;
  sumPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}
