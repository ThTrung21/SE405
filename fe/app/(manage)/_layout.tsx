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
    />
  );
}
