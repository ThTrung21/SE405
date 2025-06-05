import { ICategory } from "../interfaces/ICategory";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  categories: ICategory[];
};

type Action = {
  setCategories: (updatedCategories: ICategory[]) => void;
};

export const useCategoriesStore = create(
  immer<State & Action>((set) => ({
    categories: [],
    setCategories: (updatedCategories: ICategory[]) =>
      set((state) => {
        state.categories = updatedCategories;
      }),
  }))
);
