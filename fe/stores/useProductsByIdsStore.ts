import { IProduct } from "../interfaces/IProduct";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  productsByIds: IProduct[];
};

type Action = {
  setProductsByIds: (updatedProducts: IProduct[]) => void;
};

export const useProductsByIdsStore = create(
  immer<State & Action>((set) => ({
    productsByIds: [],
    setProductsByIds: (updatedProducts: IProduct[]) =>
      set((state) => {
        state.productsByIds = updatedProducts;
      }),
  }))
);
