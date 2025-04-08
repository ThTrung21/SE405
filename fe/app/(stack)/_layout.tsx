import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

const StackLayout: React.FC = () => {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ddd' },
          headerTintColor: '#333',
          headerShown: false,
        }}
      >
        <Stack.Screen name="cart" options={{ title: 'My Cart' }} />
        <Stack.Screen name="item" options={{ title: 'Pet Details' }} />
        <Stack.Screen name="order-success" options={{ title: 'Order Success' }} />
        <Stack.Screen name="checkout" options={{ title: 'Check Out' }} />
        <Stack.Screen name="orders" options={{ title: 'My Orders' }} />
        <Stack.Screen name="addresses" options={{ title: 'Shipping Addresses' }} />
        <Stack.Screen name="payment" options={{ title: 'Payment Methods' }} />
        <Stack.Screen name="myReviews" options={{ title: 'My Reviews' }} />
        <Stack.Screen name="addPayment" options={{ title: 'Add Payment Methods' }} />
        <Stack.Screen name="addAddress" options={{ title: 'Add Shipping Addresses' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </>
  );
};

export default StackLayout;

const styles = StyleSheet.create({});
