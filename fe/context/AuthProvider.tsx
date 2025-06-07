// context/AuthProvider.tsx
import React, { createContext, ReactNode, useContext } from "react";
import Toast from "react-native-toast-message";
// import { login } from "@/apis/auth.api";
import { useAuthStore } from "../stores/useAuthStore";
import { useAppStore } from "../stores/useAppStore";
import { router } from "expo-router";
import { Role } from "../constants/role";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

type AuthContextType = {
  logIn: (payload: { phone: string; password: string }) => Promise<void>;
  logOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const setToken = useAuthStore((state) => state.setToken);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const setProfile = useAuthStore((state) => state.setProfile);
  const reset = useAuthStore((state) => state.reset);

  const logIn = async (payload: { phone: string; password: string }) => {
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

      // Example local notification (optional)
      // await Notifications.scheduleNotificationAsync({
      //   content: {
      //     title: "Welcome!",
      //     body: `Hello ${rest.name || "User"}, you're now logged in.`,
      //   },
      //   trigger: null,
      // });

      // Navigate based on role
      if (profile.role != Role.ADMIN) {
        router.replace("/(tabs)/home");
      }
      // if (profile.role === Role.ADMIN) {
      else router.replace("/admin");
      // } else if (profile.role === Role.STAFF) {
      //   router.replace("/staff");
      // }
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

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
