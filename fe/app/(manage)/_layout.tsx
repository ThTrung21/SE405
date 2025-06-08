import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "stores/useAuthStore";

export default function ManageLayout() {
  const { profile, rehydrated } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (rehydrated && profile?.role !== "ADMIN" && profile?.role !== "STAFF") {
      router.replace("/homepage");
    }
  }, [rehydrated, profile]);

  if (!rehydrated || (profile?.role !== "ADMIN" && profile?.role !== "STAFF"))
    return null;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="product"
        options={{
          title: "Product Management",
        }}
      />
      {profile.role === "ADMIN" ? (
        <Stack.Screen
          name="staffmanage"
          options={{
            title: "Staff Management",
          }}
        />
      ) : (
        <></>
      )}
      <Stack.Screen
        name="ordermanage"
        options={{
          title: "Order Management",
        }}
      />
    </Stack>
  );
}
