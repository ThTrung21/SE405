import { Stack, useRouter } from "expo-router";
import { useAuthStore } from "stores/useAuthStore";
import { useEffect } from "react";

export default function AdminOnlyLayout() {
  const { profile, rehydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (rehydrated && profile?.role !== "ADMIN") {
      router.replace("/homepage");
    }
  }, [rehydrated, profile]);

  if (!rehydrated || profile?.role !== "ADMIN") return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
