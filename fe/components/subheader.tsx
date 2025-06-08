import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface MainHeaderProps {
  title: string;
}

const SubHeader: React.FC<MainHeaderProps> = ({ title }) => {
  const router = useRouter();
  const onBackPress = () => {
    router.back(); // Go back to the previous screen
  };
  const onCartPress = () => {
    router.push("/(stack)/cart");
  };

  return (
    <View style={styles.header}>
      {/* Search Icon */}
      <TouchableOpacity onPress={onBackPress}>
        <AntDesign name="left" size={20} color="black" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right icons container */}
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={onCartPress}>
          <Ionicons name="cart-outline" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SubHeader;

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
    marginBottom: 8,
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
