import { IUser } from "../interfaces/IUser";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  clients: IUser[];
  filteredClients: IUser[] | null;
};

type Action = {
  setClients: (clients: IUser[]) => void;
  setFilteredClients: (clients: IUser[] | null) => void;
};

export const useClientStore = create(
  immer<State & Action>((set) => ({
    clients: [],
    filteredClients: [],
    setClients: (clients: IUser[]) =>
      set((state) => {
        state.clients = clients;
      }),
    setFilteredClients: (clients: IUser[] | null) =>
      set((state) => {
        state.filteredClients = clients;
      }),
  }))
);
