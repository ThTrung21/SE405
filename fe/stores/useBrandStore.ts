import { IBrand } from "../interfaces/IBrand";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  brands: IBrand[];
};

type Action = {
  setBrands: (updatedBrands: IBrand[]) => void;
};

export const useBrandStore = create(
  immer<State & Action>((set) => ({
    brands: [],
    setBrands: (updatedBrands: IBrand[]) =>
      set((state) => {
        state.brands = updatedBrands;
      }),
  }))
);
