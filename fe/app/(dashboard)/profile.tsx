"use client";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProfileHeader from "../../components/profileHeader";
import { useRouter } from "expo-router";
import { useAuthStore } from "stores/useAuthStore";

export default function ProfileScreen() {
  const router = useRouter();

  const userProfile = useAuthStore((state) => state.profile);
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const rehydrated = useAuthStore((state) => state.rehydrated);
  useEffect(() => {
    // if (!rehydrated) {
    //   // Auth state is still being rehydrated
    //   return;
    // }
    // if (!loggedIn) {
    //   router.push("/(auth)/login");
    // }
  }, [loggedIn, rehydrated]);
  const userId = Number(userProfile?.id);
  const onOrdersPress = () => {
    router.push("/orders");
  };
  const onAddressesPress = () => {
    router.push({
      pathname: "/addresses",
      // params: { id: userId },
    });
  };
  // const onPaymentPress = () => {
  //   router.push('/payment');
  // };
  const onMyReviewsPress = () => {
    router.push("/myReviews");
  };
  const onSettingsPress = () => {
    router.push("/settings");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <ProfileHeader title="Profile" />

      <View style={styles.content}>
        <View style={styles.profileInfo}>
          <Image
            source={require("../../assets/default_avatar.jpg")}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>Bruno Pham</Text>
            <Text style={styles.email}>bruno203@gmail.com</Text>
          </View>
        </View>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardItem}
            onPress={onOrdersPress}
            activeOpacity={0.7}
          >
            <Text style={styles.cardTitle}>My orders</Text>
            <Text style={styles.cardSubtitle}>Already have 10 orders</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#ccc"
              style={styles.chevron}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cardItem}
            onPress={onAddressesPress}
            activeOpacity={0.7}
          >
            <Text style={styles.cardTitle}>Addresses</Text>
            <Text style={styles.cardSubtitle}>Default Delivery Addresses</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#ccc"
              style={styles.chevron}
            />
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.cardItem}
            onPress={onPaymentPress}
            activeOpacity={0.7}
          >
            <Text style={styles.cardTitle}>Payment Method</Text>
            <Text style={styles.cardSubtitle}>You have 2 cards</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#ccc"
              style={styles.chevron}
            />
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.cardItem}
            onPress={onMyReviewsPress}
            activeOpacity={0.7}
          >
            <Text style={styles.cardTitle}>My reviews</Text>
            <Text style={styles.cardSubtitle}>Reviews for 5 items</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#ccc"
              style={styles.chevron}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cardItem}
            onPress={onSettingsPress}
            activeOpacity={0.7}
          >
            <Text style={styles.cardTitle}>Settings</Text>
            <Text style={styles.cardSubtitle}>
              Notification, Password, FAQ, Contact
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#ccc"
              style={styles.chevron}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 24,
  },
  content: {
    padding: 16,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 40,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
  },
  email: {
    fontSize: 14,
    color: "#888",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  cardItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    position: "relative",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#888",
  },
  chevron: {
    position: "absolute",
    right: 15,
    top: "40%",
  },
});
