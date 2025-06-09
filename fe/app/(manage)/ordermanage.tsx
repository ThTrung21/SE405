import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
  Alert,
  Image,
} from "react-native";
import Header from "../../components/header";
import { Ionicons } from "@expo/vector-icons";
import { SubManagementHeader } from "components/managementHeader";

type OrderStatus = "Pending" | "Delivering" | "Completed" | "Cancelled";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: any;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  total: number;
  status: OrderStatus;
  date: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function OrderManage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      customerName: "John Doe",
      phone: "0123456789",
      address: "123 Main St, District 1, HCMC",
      total: 150.0,
      status: "Pending",
      date: "2024-03-20",
      createdAt: "2024-03-19 10:00",
      updatedAt: "2024-03-20 09:00",
      items: [
        {
          name: "Dog Food",
          quantity: 2,
          price: 30,
          image: require("../../assets/dog1.png"),
        },
        {
          name: "Cat Toy",
          quantity: 1,
          price: 20,
          image: require("../../assets/cat1.png"),
        },
        {
          name: "Bird Cage",
          quantity: 1,
          price: 70,
          image: require("../../assets/bird1.png"),
        },
      ],
    },
    {
      id: "2",
      customerName: "Jane Smith",
      phone: "0987654321",
      address: "456 Le Loi, District 3, HCMC",
      total: 80.0,
      status: "Delivering",
      date: "2024-03-21",
      createdAt: "2024-03-20 14:00",
      updatedAt: "2024-03-21 08:00",
      items: [
        {
          name: "Cat Food",
          quantity: 2,
          price: 20,
          image: require("../../assets/cat1.png"),
        },
        {
          name: "Dog Toy",
          quantity: 2,
          price: 20,
          image: require("../../assets/dog2.png"),
        },
      ],
    },
    {
      id: "3",
      customerName: "Alice Brown",
      phone: "0111222333",
      address: "789 Tran Hung Dao, District 5, HCMC",
      total: 50.0,
      status: "Completed",
      date: "2024-03-19",
      createdAt: "2024-03-18 16:00",
      updatedAt: "2024-03-19 12:00",
      items: [
        {
          name: "Hamster Wheel",
          quantity: 1,
          price: 50,
          image: require("../../assets/hamster1.png"),
        },
      ],
    },
    {
      id: "4",
      customerName: "Bob Lee",
      phone: "0999888777",
      address: "321 Nguyen Hue, District 1, HCMC",
      total: 30.0,
      status: "Cancelled",
      date: "2024-03-18",
      createdAt: "2024-03-17 09:00",
      updatedAt: "2024-03-18 07:00",
      items: [
        {
          name: "Fish Food",
          quantity: 3,
          price: 10,
          image: require("../../assets/fish1.png"),
        },
      ],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setShowStatusModal(false);
  };

  const handleDeleteOrder = (orderId: string) => {
    Alert.alert("Delete Order", "Are you sure you want to delete this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setOrders(orders.filter((order) => order.id !== orderId));
          setShowStatusModal(false);
        },
      },
    ]);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "#FFA500";
      case "Cancelled":
        return "#FF0000";
      case "Delivering":
        return "#FFA500";
      case "Completed":
        return "#00C853";
      default:
        return "#666";
    }
  };

  return (
    <View style={styles.container}>
      <SubManagementHeader title="Order Management" />
      <View style={styles.content}>
        <ScrollView>
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => {
                setSelectedOrder(order);
                setShowStatusModal(true);
              }}
            >
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <Text style={styles.customerName}>{order.customerName}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(order.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Modal
          visible={showStatusModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowStatusModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeIconBtn}
                onPress={() => setShowStatusModal(false)}
              >
                <Ionicons name="close" size={28} color="#888" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Order Details</Text>
              {selectedOrder && (
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>
                    Customer Name:{" "}
                    <Text style={styles.infoValue}>
                      {selectedOrder.customerName}
                    </Text>
                  </Text>
                  <Text style={styles.infoLabel}>
                    Phone:{" "}
                    <Text style={styles.infoValue}>{selectedOrder.phone}</Text>
                  </Text>
                  <Text style={styles.infoLabel}>
                    Address:{" "}
                    <Text style={styles.infoValue}>
                      {selectedOrder.address}
                    </Text>
                  </Text>
                  <Text style={styles.infoLabel}>
                    Created At:{" "}
                    <Text style={styles.infoValue}>
                      {selectedOrder.createdAt}
                    </Text>
                  </Text>
                  <Text style={styles.infoLabel}>
                    Updated At:{" "}
                    <Text style={styles.infoValue}>
                      {selectedOrder.updatedAt}
                    </Text>
                  </Text>
                </View>
              )}
              {selectedOrder?.items && (
                <View style={styles.itemsList}>
                  {selectedOrder.items.map((item, idx) => (
                    <View key={idx} style={styles.itemRow}>
                      <Image source={item.image} style={styles.itemImage} />
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQty}>x{item.quantity}</Text>
                      <Text style={styles.itemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>
                      ${selectedOrder.total.toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}
              <View style={styles.statusLabelRow}>
                <Text style={styles.statusLabel}>Status:</Text>
                <Text
                  style={[
                    styles.statusValue,
                    {
                      color: getStatusColor(selectedOrder?.status || "Pending"),
                    },
                  ]}
                >
                  {selectedOrder?.status}
                </Text>
              </View>
              {selectedOrder && (
                <View style={styles.actionButtonsRow}>
                  {selectedOrder.status === "Pending" && (
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() =>
                        updateOrderStatus(selectedOrder.id, "Delivering")
                      }
                    >
                      <Text style={styles.actionBtnText}>Deliver</Text>
                    </TouchableOpacity>
                  )}
                  {selectedOrder.status === "Delivering" && (
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() =>
                        updateOrderStatus(selectedOrder.id, "Completed")
                      }
                    >
                      <Text style={styles.actionBtnText}>Complete</Text>
                    </TouchableOpacity>
                  )}
                  {(selectedOrder.status === "Pending" ||
                    selectedOrder.status === "Cancelled") && (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.deleteBtn]}
                      onPress={() => handleDeleteOrder(selectedOrder.id)}
                    >
                      <Text style={[styles.actionBtnText, { color: "#fff" }]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
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
  orderCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  orderInfo: {
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  customerName: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  orderDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003459",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    maxWidth: 400,
    position: "relative",
  },
  closeIconBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 18,
    textAlign: "center",
  },
  infoBlock: {
    marginBottom: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: "#003459",
    fontWeight: "bold",
    marginBottom: 2,
  },
  infoValue: {
    fontWeight: "normal",
    color: "#333",
  },
  itemsList: {
    marginBottom: 18,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 12,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 17,
    color: "#222",
    fontWeight: "500",
    flex: 1,
  },
  itemQty: {
    fontSize: 17,
    color: "#003459",
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  itemPrice: {
    fontSize: 17,
    color: "#E57373",
    fontWeight: "bold",
    minWidth: 70,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003459",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003459",
  },
  statusLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 6,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    marginTop: 18,
    marginBottom: 0,
  },
  actionBtn: {
    backgroundColor: "#003459",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteBtn: {
    backgroundColor: "#E57373",
  },
  itemImage: {
    width: 36,
    height: 36,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: "#f5f5f5",
    resizeMode: "cover",
  },
});
