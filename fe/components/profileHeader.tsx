import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { logOut } from "utils/auth";
import { useAuthStore } from "stores/useAuthStore";

interface ProfileHeaderProps {
  title: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title }) => {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const onBackPress = () => {
    router.back(); // Go back to the previous screen
  };
  const onLogoutPress = () => {
    logOut();
    console.log(profile);
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.header}>
      {/* Search Icon */}
      <TouchableOpacity onPress={onBackPress} activeOpacity={0.7}>
        <AntDesign name="left" size={20} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right icons container */}
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={onLogoutPress} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create<{
  header: ViewStyle;
  title: TextStyle;
  headerIcons: ViewStyle;
}>({
  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
