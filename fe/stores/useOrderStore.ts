import { IOrder } from "../interfaces/IOrder";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  orders: IOrder[];
};

type Action = {
  setOrders: (updatedOrders: IOrder[]) => void;
};

export const useOrdersStore = create(
  immer<State & Action>((set) => ({
    orders: [],
    setOrders: (updatedOrders: IOrder[]) =>
      set((state) => {
        state.orders = updatedOrders;
      }),
  }))
);
