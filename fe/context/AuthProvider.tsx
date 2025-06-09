// context/AuthProvider.tsx
import React, { createContext, ReactNode, useContext } from "react";
import Toast from "react-native-toast-message";
// import { login } from "@/apis/auth.api";
import { useAuthStore } from "../stores/useAuthStore";
import { useAppStore } from "../stores/useAppStore";
import { router, useRouter } from "expo-router";
import { Role } from "../constants/role";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { login } from "apis/auth.api";

type AuthContextType = {
  logIn: (payload: { email: string; password: string }) => Promise<void>;
  logOut: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const setToken = useAuthStore((state) => state.setToken);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const setProfile = useAuthStore((state) => state.setProfile);
  const reset = useAuthStore((state) => state.reset);
  const navigate = useRouter();
  const profile = useAuthStore((state) => state.profile);

  const logIn = async (payload: any) => {
    setIsLoading(true);
    try {
      const { data: profile, token }: any = await login(payload);
      const { password, ...rest } = profile;

      setToken(token);
      setProfile(rest);
      setLoggedIn(true);
      setIsLoading(false);

      Toast.show({
        type: "success",
        text1: "Login successful",
        visibilityTime: 1000,
      });

      router.replace("/(dashboard)/homepage");
    } catch (error: any) {
      setIsLoading(false);
      console.error(error);

      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: error?.response?.data?.message || error.message,
      });
    }
  };

  const logOut = () => {
    reset();
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
//   return ctx;
// };

// Request push notification permissions
// const { status: existingStatus } = await Notifications.getPermissionsAsync();
// let finalStatus = existingStatus;
// if (existingStatus !== 'granted') {
//   const { status } = await Notifications.requestPermissionsAsync();
//   finalStatus = status;
// }
// if (finalStatus === 'granted') {
//   const token = (await Notifications.getExpoPushTokenAsync()).data;
//   console.log("Expo push token:", token);
// }
