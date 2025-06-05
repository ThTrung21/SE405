import httpRequest from "services/httpRequest";
import { IMessage } from "../interfaces/IMessage";
import { IConversation } from "interfaces/IConversation";

// Create a generic conversation (e.g. staff <-> user)
export const createGenericConversation = (data: any) => {
  return httpRequest.post("/chats/generic", data);
};

// Create a conversation linked to an order
export const createOrderConversation = (data: any) => {
  return httpRequest.post("/chats/order", data);
};

// Mark a conversation as completed
export const completeOrderConversation = (
  conversationId: string,
  data: any
) => {
  return httpRequest.put(`/chats/${conversationId}/complete`, data);
};

// Get all messages for a conversation
export const getMessages = (conversationId: string) => {
  return httpRequest.get(`/chats/${conversationId}/messages`);
};

// Send a message
export const sendMessage = (data: any) => {
  return httpRequest.post("/chats/message", data);
};
