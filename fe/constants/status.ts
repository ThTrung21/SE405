export enum OrderStatus {
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  DELIVERED = "DELIVERED",
  DELIVERING = "DELIVERING",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  OFFLINE = "OFFLINE",
  TERMINATED = "TERMINATED",
}
export enum ChatType {
  GENERIC = "GENERIC",
  ORDERBOUND = "ORDERBOUND",
}
export enum ChatStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED", //for order-bound conversation
  EXPIRED = "EXPIRED",
}
