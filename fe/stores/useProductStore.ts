import { IProduct } from "../interfaces/IProduct";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  product: IProduct | null;
  products: IProduct[];
  filteredProducts: IProduct[] | null;
  sortBy: string;
};

type Action = {
  setProduct: (updatedProduct: IProduct) => void;
  setProducts: (updatedProducts: IProduct[]) => void;
  setFilteredProducts: (updatedProducts: IProduct[] | null) => void;
  setSortBy: (value: string) => void;
};

export const useProductStore = create(
  immer<State & Action>((set) => ({
    product: null,
    products: [],
    filteredProducts: null,
    sortBy: "low",
    setProduct: (updatedProduct: IProduct) =>
      set((state) => {
        state.product = updatedProduct;
      }),
    setProducts: (updatedProducts: IProduct[]) =>
      set((state) => {
        state.products = updatedProducts;
      }),
    setFilteredProducts: (updatedProducts: IProduct[] | null) =>
      set((state) => {
        state.filteredProducts = updatedProducts;
      }),
    setSortBy: (value: string) =>
      set((state) => {
        state.sortBy = value;
      }),
  }))
);
