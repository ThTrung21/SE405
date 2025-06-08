"use client";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Header from "../../components/header";
import AppButton from "../../components/appButton";
import { useCartStore } from "stores/useCartStore";
import { router } from "expo-router";

export default function CartScreen() {
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const cart = useCartStore((state) => state.cart);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const handleCheckout = () => {
    const selectedOrders = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.images[0], // only include the first image
    }));

    const payload = {
      items: selectedOrders,
      total,
    };
    const serializedOrders = encodeURIComponent(JSON.stringify(payload));
    router.push(`/checkout?orders=${serializedOrders}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header title="My Cart" />

      <FlatList
        style={styles.listitemcontainer}
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.images[0] }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${item.price}</Text>
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  onPress={() => updateItemQuantity(item.id, item.quantity - 1)}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateItemQuantity(item.id, item.quantity + 1)}
                >
                  <Ionicons name="add-circle-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>

        {/* Checkout */}
        <AppButton title="Check Out" onPress={handleCheckout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  bottomContainer: {
    // marginBottom: 24,
    paddingHorizontal: 16,
  },
  info: {
    flex: 1,
    marginHorizontal: 12,
  },
  listitemcontainer: {
    padding: 24,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "500",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 10,
  },
  quantityText: {
    fontSize: 16,
    width: 36,
    textAlign: "center",
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
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
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
});
