import { Stack, useRouter } from "expo-router";

export default function AdminOnlyLayout() {
  const router = useRouter();

  return <Stack screenOptions={{ headerShown: false }} />;
}
