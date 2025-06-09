import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
  Alert,
  Image,
  FlatList,
} from "react-native";
import Header from "../../components/header";
import { Ionicons } from "@expo/vector-icons";
import { SubManagementHeader } from "components/managementHeader";
import { IOrder } from "interfaces/IOrder";
import { useAppStore } from "stores/useAppStore";
import { useOrdersStore } from "stores/useOrderStore";
import { useAuthStore } from "stores/useAuthStore";
import { cancelOrder, changeOrderStatus, getAllOrders } from "apis/order.api";
import Toast from "react-native-toast-message";
import { OrderStatus } from "constants/status";
// type OrderStatus = "Pending" | "Delivering" | "Delivered" | "Cancelled";

export default function OrderManage() {
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const orders = useOrdersStore((state) => state.orders);
  const setOrders = useOrdersStore((state) => state.setOrders);
  const profile = useAuthStore((state) => state.profile);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const productData = await getAllOrders();
        setOrders(productData.data);
        console.log(productData.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredOrders = orders
    .filter(
      (order) => order.status !== "DELIVERED" && order.status !== "CANCELLED"
    )
    .sort((a, b) => {
      // Prioritize PENDING orders
      if (a.status === "PENDING" && b.status !== "PENDING") return -1;
      if (a.status !== "PENDING" && b.status === "PENDING") return 1;

      // If both are PENDING or both are not, sort by date (oldest first)
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const updateOrderStatus = async (_order: IOrder, newStatus: OrderStatus) => {
    const _id = _order.id;
    if (newStatus === OrderStatus.CANCELLED) return;
    setIsLoading(true);
    try {
      await changeOrderStatus(_id, newStatus);
      const da = await getAllOrders();
      setOrders(da.data);
      Toast.show({
        type: "success",
        text1: "Order updated",
        visibilityTime: 1000,
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Something went wrong. Please try again",

        visibilityTime: 1500,
      });
    } finally {
      setIsLoading(false);
      setShowStatusModal(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    const _id = selectedOrder.id;
    await cancelOrder(_id);
    const da = await getAllOrders();
    setOrders(da.data);
    try {
    } catch {
      Toast.show({
        type: "error",
        text1: "Something went wrong. Please try again",

        visibilityTime: 1500,
      });
    } finally {
      setShowStatusModal(false);
      setConfirmationVisible(false);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#ffb835";
      case "CANCELLED":
        return "#FF0000";
      case "DELIVERING":
        return "#6cfc7f";
      case "DELIVERED":
        return "#00b017";
      default:
        return "#666";
    }
  };

  return (
    <View style={styles.container}>
      <SubManagementHeader title="Order Management" />
      <View style={styles.content}>
        <FlatList
          data={filteredOrders}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: order }) => (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => {
                setSelectedOrder(order);
                setShowStatusModal(true);
              }}
            >
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <Text style={styles.customerName}>{order.receiptName}</Text>
                <Text style={styles.orderDate}>
                  {order.createdAt.toString().split("T")[0]}
                </Text>
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.orderTotal}>${order.orderPrice}</Text>
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
          )}
        />

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
                      {selectedOrder.receiptName}
                    </Text>
                  </Text>
                  <Text style={styles.infoLabel}>
                    Phone:{" "}
                    <Text style={styles.infoValue}>
                      {selectedOrder.receiptPhone}
                    </Text>
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
                      {selectedOrder.createdAt.toString().split("T")[0]}
                    </Text>
                  </Text>
                  <Text style={styles.infoLabel}>
                    Updated At:{" "}
                    <Text style={styles.infoValue}>
                      {selectedOrder.updatedAt.toString().split("T")[0]}
                    </Text>
                  </Text>
                </View>
              )}
              {selectedOrder?.OrderItemModels && (
                <View style={styles.itemsList}>
                  {selectedOrder.OrderItemModels.map((item, idx) => (
                    <View key={idx} style={styles.itemRow}>
                      <Image
                        source={{ uri: item.ProductModel.images[0] }}
                        style={styles.itemImage}
                      />
                      <Text style={styles.itemName}>
                        {item.ProductModel.name}
                      </Text>
                      <Text style={styles.itemQty}>x{item.quantity}</Text>
                      <Text style={styles.itemPrice}>${item.sumPrice}</Text>
                    </View>
                  ))}
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>
                      ${selectedOrder.orderPrice}
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
                      color: getStatusColor(selectedOrder?.status || "PENDING"),
                    },
                  ]}
                >
                  {selectedOrder?.status}
                </Text>
              </View>
              {selectedOrder && (
                <View style={styles.actionButtonsRow}>
                  {selectedOrder.status === "PENDING" && (
                    <>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() =>
                          updateOrderStatus(
                            selectedOrder,
                            OrderStatus.DELIVERING
                          )
                        }
                      >
                        <Text style={styles.actionBtnText}>Process</Text>
                      </TouchableOpacity>
                      {/* <TouchableOpacity
                        style={[styles.actionBtn, styles.cancelBtn]}
                        onPress={() => setShowDetailModal(false)}
                      >
                        <Text style={styles.actionBtnText}>Cancel</Text>
                      </TouchableOpacity> */}
                    </>
                  )}

                  {selectedOrder.status === "DELIVERING" && (
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() =>
                        updateOrderStatus(selectedOrder, OrderStatus.DELIVERED)
                      }
                    >
                      <Text style={styles.actionBtnText}>Complete</Text>
                    </TouchableOpacity>
                  )}

                  {(selectedOrder.status === "PENDING" ||
                    selectedOrder.status === "CANCELLED") && (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.deleteBtn]}
                      onPress={() => {
                        setConfirmationVisible(true);
                      }}
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

        <Modal visible={confirmationVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay2}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>Are you sure?</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => setConfirmationVisible(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCancelOrder}
                  style={styles.confirmBtn}
                >
                  <Text style={styles.confirmBtnText}>Yes</Text>
                </TouchableOpacity>
              </View>
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
    fontWeight: "bold",
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
  modalOverlay2: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    width: "48%",
    alignItems: "center",
  },
  confirmBtn: {
    backgroundColor: "#8B0000", // Dark red
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    width: "48%",
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#333",
    fontWeight: "bold",
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
