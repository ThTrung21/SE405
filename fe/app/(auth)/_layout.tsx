// import { StatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import React from 'react';
import { Stack } from 'expo-router';

const AuthLayout: React.FC = () => {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="signup" options={{ title: 'SignUp', headerShown: false }} />
      </Stack>
    </>
  );
};

export default AuthLayout;
