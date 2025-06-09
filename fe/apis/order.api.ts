import { OrderStatus } from "../constants/status";
import httpRequest from "../services/httpRequest";

export const getAllOrders = () => {
  return httpRequest.get("/orders");
};
export const getOrderByUserId = (userId: any) => {
  return httpRequest.get(`/orders/user/${userId}`);
};
export const addOrder = (data: any) => {
  return httpRequest.post("/orders", data);
};

export const cancelOrder = (orderId: string | number) => {
  return httpRequest.put(`/orders/${orderId}`, {
    status: OrderStatus.CANCELLED,
  });
};

export const changeOrderStatus = (
  orderId: string | number,
  status: OrderStatus
) => {
  return httpRequest.put(`/orders/${orderId}`, {
    status: status,
  });
};
