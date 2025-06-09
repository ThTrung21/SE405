import { TokenPayload } from "../interfaces/IAuth";
import { IUser } from "../interfaces/IUser";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  token: TokenPayload;
  loggedIn: boolean;
  profile: IUser | null;
  rehydrated: boolean;
};

type Action = {
  setToken: (token: TokenPayload) => void;
  setLoggedIn: (status: boolean) => void;
  setProfile: (profile: IUser) => void;
  reset: () => void;
};

const initState: State = {
  token: {
    accessToken: "",
    refreshToken: "",
  },
  loggedIn: false,
  profile: null,
  rehydrated: false,
};

export const useAuthStore = create(
  persist<State & Action>(
    (set) => ({
      ...initState,
      setToken: (token: TokenPayload) => set({ token, rehydrated: true }),
      setLoggedIn: (status: boolean) =>
        set({ loggedIn: status, rehydrated: true }),
      setProfile: (profile: IUser) => set({ profile, rehydrated: true }),
      reset: () => {
        set({
          token: { accessToken: "", refreshToken: "" },
          loggedIn: false,
          profile: null,
          rehydrated: true, // Ensure rehydrated is true after reset
        });
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.rehydrated = true;
        }
      },
    }
  )
);
