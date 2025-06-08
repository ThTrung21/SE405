"use client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/header";
import AppButton from "../../components/appButton";
import { useAuthStore } from "stores/useAuthStore";
import { ICart } from "interfaces/ICart";
import Toast from "react-native-toast-message";
import { addOrder } from "apis/order.api";
import { useCartStore } from "stores/useCartStore";

export default function CheckoutScreen() {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const rehydrated = useAuthStore((state) => state.rehydrated);
  const userProfile = useAuthStore((state) => state.profile);
  const [data, setData] = useState<ICart[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  //update info modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  useState(false);
  const [checkoutResult, setCheckoutResult] = useState("");
  const [editName, setEditName] = useState(name);
  const [editAddress, setEditAddress] = useState(address);
  const [editPhone, setEditPhone] = useState(phone);
  const { orders } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const onPlaceOrderPress = () => {
    router.replace("/order-success");
  };

  useEffect(() => {
    if (!rehydrated || !orders) {
      // Auth state is still being rehydrated
      return;
    }
    if (!loggedIn) {
      // if (!loggedIn) {
      router.push("/(auth)/login");
      return;
    }
    console.log(userProfile);
    //set default value for delivery info as user's info
    if (userProfile) {
      setAddress(userProfile.address || "");
      setPhone(userProfile.phone || "");
      setName(userProfile.fullname || "");
    }

    if (orders) {
      const parsed = JSON.parse(decodeURIComponent(orders as string));
      setData(parsed.items);

      setOrderTotal(parsed.total);
    }
    setIsLoading(false);
  }, [loggedIn, rehydrated]);
  const deliveryFee = 5;
  const total = orderTotal + deliveryFee;

  const handleUpdateDeliveryInfo = () => {
    setName(editName);
    setAddress(editAddress);
    setPhone(editPhone);
    setIsModalVisible(false);
  };
  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const payload = {
        receiptAddress: address,
        receiptName: name,
        receiptPhone: phone,
        orderPrice: total,
        products: data.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };
      const response = await addOrder(payload);

      data.forEach((item) => {
        removeFromCart(item.id);
      });

      setOrderSuccess(true);
      setModalMessage("Order placed successfully!");
    } catch (error: any) {
      console.error("Checkout failed:", error);
      setOrderSuccess(false);

      if (error.response?.data?.message) {
        setModalMessage(`Failed: ${error.response.data.message}`);
      } else {
        setModalMessage("Failed to place order. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setModal2Visible(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Check Out" />
      {/* update delivery info modal */}
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
      {/* checkout result modal */}
      <Modal visible={modal2Visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModal2Visible(false);
                if (true) {
                  router.push("/homepage");
                }
              }}
            >
              <Text style={styles.modalButtonText}>
                {orderSuccess ? "Go Home" : "Close"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* order item list */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your order:</Text>

        <FlatList
          style={styles.listitemcontainer}
          data={data}
          keyExtractor={(item) => item.id.toString()}
          // ListHeaderComponent={
          //   <Text style={styles.sectionTitle}>Your Order:</Text>
          // }
          renderItem={({ item }) => (
            <View style={styles.checkoutItemCard}>
              <View style={styles.checkoutTextGroup}>
                <Text style={styles.checkoutItemName}>{item.name}</Text>
                <Text style={styles.checkoutItemPrice}>${item.price}</Text>
                <Text style={styles.checkoutItemQuantity}>
                  Qty: {item.quantity}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Shipping Address */}
        <View style={styles.section}>
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
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Payment</Text>
          </View>
          <View style={styles.cash}>
            <View style={styles.paymentRow}>
              <MaterialCommunityIcons
                name="cash-multiple"
                size={18}
                color="#6b7280"
              />
              <Text style={styles.paymentText}>Cash on Delivery</Text>
            </View>
          </View>
        </View>
        <View>
          {/* Promo Code */}
          <View style={styles.promoRow}>
            <TextInput
              placeholder="Enter your promo code"
              style={styles.promoInput}
              value={promoCode}
              onChangeText={setPromoCode}
            />
            <TouchableOpacity style={styles.promoButton}>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Price Summary */}
      <View style={styles.footer}>
        <View style={styles.summary}>
          <View style={styles.rowBetween}>
            <Text>Order:</Text>
            <Text>${orderTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text>Delivery:</Text>
            <Text>${deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${total}</Text>
          </View>
        </View>

        {/* Submit Button */}
        <AppButton title="SUBMIT ORDER" onPress={handleCheckout} />
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
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  cash: {
    padding: 12,
    borderRadius: 10,
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
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  paymentText: {
    fontSize: 16,
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  deliveryLogo: {
    width: 40,
    height: 20,
    resizeMode: "contain",
  },
  deliveryText: {
    fontSize: 15,
  },
  summary: {
    marginVertical: 20,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  promoRow: {
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 16,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  promoButton: {
    backgroundColor: "#003459",
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginLeft: 8,
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
  listitemcontainer: {
    paddingHorizontal: 24,
    paddingVertical: 4,
    maxHeight: 220,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "500",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  price: {
    fontSize: 14,
    color: "#10b981",
  },
  info: {
    flex: 1,
    marginHorizontal: 12,
  },
  checkoutItemCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  checkoutTextGroup: {
    flexDirection: "column",
  },

  checkoutItemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#111827", // dark slate
  },

  checkoutItemPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563", // gray-700
  },

  checkoutItemQuantity: {
    fontSize: 14,
    color: "#6B7280", // gray-500
  },
});
