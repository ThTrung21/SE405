// import { StatusBar} from 'react-native'
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import AuthProvider from "context/AuthProvider";

const RootLayout: React.FC = () => {
  return (
    <>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#ddd" },
            headerTintColor: "#333",
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" options={{ title: "Welcome" }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
          <Stack.Screen name="(stack)" options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </AuthProvider>
    </>
  );
};

export default RootLayout;
