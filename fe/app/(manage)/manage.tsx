"use client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "../../components/header";
import Colors from "../../constants/Colors";
import { useAuthStore } from "stores/useAuthStore";
import {
  ManagementHeader,
  SubManagementHeader,
} from "components/managementHeader";

const ManagementOption = ({
  title,
  icon,
  onPress,
  active,
}: {
  title: string;
  icon: string;
  onPress: () => void;
  active?: boolean;
}) => (
  <TouchableOpacity
    style={[styles.option, active && styles.activeOption]}
    onPress={onPress}
  >
    <View style={[styles.iconContainer, active && styles.activeIconContainer]}>
      <Ionicons
        name={icon as any}
        size={24}
        color={active ? "#fff" : "#003459"}
      />
    </View>
    <Text style={[styles.optionText, active && styles.activeOptionText]}>
      {title}
    </Text>
    <Ionicons name="chevron-forward" size={20} color="#666" />
  </TouchableOpacity>
);
const options1 = [
  {
    title: "Product Manage",
    icon: "cube-outline",
    route: "/productmanage",
  },
  {
    title: "Staff Manage",
    icon: "people-outline",
    route: "/(manage)/staffmanage",
  },
  {
    title: "Order Manage",
    icon: "receipt-outline",
    route: "/(manage)/ordermanage",
  },
];

const options2 = [
  {
    title: "Product Manage",
    icon: "cube-outline",
    route: "/(manage)/productmanage",
  },
  {
    title: "Order Manage",
    icon: "receipt-outline",
    route: "/(manage)/ordermanage",
  },
];
export default function ManageScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const profile = useAuthStore((state) => state.profile);
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const [userRole, setUserRole] = useState("");
  // const rehydrated = useAuthStore((state) => state.rehydrated);
  useEffect(() => {
    // if (rehydrated && (!loggedIn || !profile)) {
    if (!loggedIn || !profile) {
      router.replace("/(auth)/login");
    }
    console.log(profile);
    if (profile) {
      setUserRole(profile.role);
    }
  }, [loggedIn, profile]);
  // }, [rehydrated, loggedIn, profile]);
  // if (!rehydrated || !loggedIn || !profile) return null;

  let renderoption;
  if (profile?.role === "STAFF") renderoption = options2;
  else renderoption = options1;
  return (
    <View style={styles.container}>
      <ManagementHeader title="Management" />
      <ScrollView style={styles.content}>
        {renderoption.map((option, index) => (
          <ManagementOption
            key={index}
            title={option.title}
            icon={option.icon}
            onPress={() => {
              setActiveIndex(index);
              router.push(option.route);
            }}
            active={activeIndex === index}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  activeOption: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activeIconContainer: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  activeOptionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
