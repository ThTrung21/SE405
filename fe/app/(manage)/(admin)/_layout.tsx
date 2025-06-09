import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "stores/useAuthStore";

export default function AdminOnlyLayout() {
  const router = useRouter();
  const { profile, rehydrated } = useAuthStore();

  useEffect(() => {
    if (rehydrated && profile?.role !== "ADMIN") {
      router.replace("/homepage");
    }
  }, [rehydrated, profile]);

  if (!rehydrated || profile?.role !== "ADMIN") return null;
  return <Stack screenOptions={{ headerShown: false }} />;
}
