import { TokenPayload } from "../interfaces/IAuth";
import { IUser } from "../interfaces/IUser";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  token: TokenPayload;
  loggedIn: boolean;
  profile: IUser | null;
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
};

export const useAuthStore = create(
  persist<State & Action>(
    (set) => ({
      ...initState,
      setToken: (token: TokenPayload) => set((state) => ({ token })),
      setLoggedIn: (status: boolean) => set((state) => ({ loggedIn: status })),
      setProfile: (updatedProfile: IUser) =>
        set((state) => ({ profile: { ...state.profile, ...updatedProfile } })),
      reset: () => set({ ...initState }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
      // onRehydrateStorage: () => (state) => {
      //   if (state) {
      //     state.rehydrated = true;
      //   }
      // },
    }
  )
);
