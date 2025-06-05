import { ICart } from "../interfaces/ICart";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  cart: ICart[];
};

type Action = {
  addToCart: (item: ICart) => void;
  removeFromCart: (id: string | number) => void;
  updateItemQuantity: (id: string | number, value: number) => void;
  reset: () => void;
};

const initState: State = {
  cart: [],
};

export const useCartStore = create(
  persist<State & Action>(
    (set) => ({
      ...initState,
      addToCart: (item: ICart) =>
        set((state) => {
          const itemIndex = state.cart.findIndex(
            (cartItem) => cartItem.id === item.id
          );
          if (itemIndex !== -1) {
            state.cart[itemIndex].quantity += item.quantity;
            return { cart: state.cart };
          } else {
            return { cart: [...state.cart, item] };
          }
        }),
      removeFromCart: (id: string | number) =>
        set((state) => {
          const newCart = state.cart.filter((item) => item.id !== id);
          return { cart: newCart };
        }),
      updateItemQuantity: (id: string | number, value: number) =>
        set((state) => {
          const itemIndex = state.cart.findIndex((item) => item.id === id);
          const newCart = [...state.cart];
          if (itemIndex !== -1) {
            if (value === 0) {
              return { cart: newCart.filter((item) => item.id !== id) };
            } else {
              newCart[itemIndex].quantity = value;
            }
          }
          return { cart: newCart };
        }),
      reset: () => set({ ...initState }),
    }),
    {
      name: "cart", // unique name
      storage: createJSONStorage(() => localStorage),
    }
  )
);
