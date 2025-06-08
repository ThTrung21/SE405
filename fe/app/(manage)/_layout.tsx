import { Stack } from 'expo-router';

export default function ManageLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="product" 
        options={{
          title: 'Product Management'
        }}
      />
      <Stack.Screen 
        name="staffmanage" 
        options={{
          title: 'Staff Management'
        }}
      />
      <Stack.Screen 
        name="ordermanage" 
        options={{
          title: 'Order Management'
        }}
      />
    </Stack>
  );
} 