import { IUser } from "../interfaces/IUser";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  staff: IUser[];
  filteredStaff: IUser[] | null;
};

type Action = {
  setStaff: (staff: IUser[]) => void;
  setFilteredStaff: (staff: IUser[] | null) => void;
};

export const useStaffStore = create(
  immer<State & Action>((set) => ({
    staff: [],
    filteredStaff: [],
    setStaff: (staff: IUser[]) =>
      set((state) => {
        state.staff = staff;
      }),
    setFilteredStaff: (staff: IUser[] | null) =>
      set((state) => {
        state.filteredStaff = staff;
      }),
  }))
);
