import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ListRenderItem,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/header";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "stores/useAuthStore";

type Address = {
  id: number;
  name: string;
  address: string;
};
const addresses: Address[] = [
  {
    id: 1,
    name: "Bruno Fernandes",
    address: "25 rue Robert Latouche, Nice, 06200, Côte D’azur, France",
  },
];

const ShippingAddressScreen: React.FC = () => {
  const userProfile = useAuthStore((state) => state.profile);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedId, setSelectedId] = useState<number>(1);
  const router = useRouter();
  const [editName, setEditName] = useState(name);
  const [editAddress, setEditAddress] = useState(address);
  const [editPhone, setEditPhone] = useState(phone);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onAddPress = () => {
    setIsModalVisible(true);
  };
  const handleUpdateDeliveryInfo = () => {
    setName(editName);
    setAddress(editAddress);
    setPhone(editPhone);
    setIsModalVisible(false);
  };
  if (userProfile) {
    setAddress(userProfile.address || "");
    setPhone(userProfile.phone || "");
    setName(userProfile.fullname || "");
  }

  return (
    <View style={styles.section}>
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Delivery Info</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Name"
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Address"
              value={editAddress}
              onChangeText={setEditAddress}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Phone"
              value={editPhone}
              onChangeText={setEditPhone}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleUpdateDeliveryInfo}
            >
              <Text style={styles.modalButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Ionicons name="create-outline" size={18} color="#6b7280" />
        </TouchableOpacity>
      </View>
      <View style={styles.cash}>
        <Text style={styles.bold}>{name}</Text>
        <Text style={styles.gray}>{address}</Text>
        <Text style={styles.gray}>{phone}</Text>
      </View>
      <TouchableOpacity onPress={onAddPress}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default ShippingAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 24,
  },
  bold: {
    fontWeight: "600",
    fontSize: 16,
  },
  gray: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 4,
  },
  cash: {
    padding: 12,
    borderRadius: 10,
  },
  section: {
    marginBottom: 20,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  content: {
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: "#003459",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
