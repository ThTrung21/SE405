import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  FlatList,
} from "react-native";
import Header from "../../components/header";
import { useOrdersStore } from "stores/useOrderStore";
import { useAppStore } from "stores/useAppStore";
import { getAllOrders, getOrderByUserId } from "apis/order.api";
import SubHeader, { MyOrderHeader } from "components/subheader";
import { IOrder } from "interfaces/IOrder";
import { useAuthStore } from "stores/useAuthStore";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  image: any;
};

type Order = {
  id: string;
  number: string;
  quantity: number;
  amount: number;
  date: string;
  status: string;
  items: OrderItem[];
};

const tabs: string[] = ["Pending", "Delivering", "Delivered", "Canceled"];

export default function MyOrderScreen() {
  const [activeTab, setActiveTab] = useState<string>("Delivered");
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const orders = useOrdersStore((state) => state.orders);
  const setOrders = useOrdersStore((state) => state.setOrders);
  const profile = useAuthStore((state) => state.profile);
  // Filter orders by active tab if needed:

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const productData = await getOrderByUserId(profile?.id);
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
  const filteredOrders = orders.filter(
    (order) =>
      order.status === activeTab.toString().toUpperCase() &&
      order.userId === profile?.id
  );

  return (
    <View style={styles.container}>
      <MyOrderHeader title="My Orders" />
      <View style={styles.content}>
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabItem,
                activeTab === tab && styles.activeTabItem,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredOrders}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardRow}>
                {item.OrderItemModels && item.OrderItemModels[0] && (
                  <Image
                    source={{
                      uri: item.OrderItemModels?.[0]?.ProductModel?.images?.[0],
                    }}
                    style={styles.orderImage}
                  />
                )}
                <View style={{ flex: 1 }}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.orderNumber}>Order {item.id}</Text>
                    <Text style={styles.date}>
                      {item.createdAt.toString().split("T")[0]}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    {/* <Text style={styles.text}>
                        Quantity: {item.quantity.toString().padStart(2, "0")}
                      </Text> */}
                    <Text style={styles.text}>
                      Total Amount:{" "}
                      <Text style={styles.amount}>${item.orderPrice}</Text>
                    </Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <TouchableOpacity
                      style={styles.detailButton}
                      onPress={() => {
                        setSelectedOrder(item);
                        setShowDetailModal(true);
                      }}
                    >
                      <Text style={styles.detailText}>Detail</Text>
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.status,
                        item.status === "Canceled"
                          ? { color: "red" }
                          : { color: "green" },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          style={{ flex: 1 }}
        />
      </View>

      {/* Modal chi tiết order giống Order Manage, chỉ có nút X */}
      <Modal visible={showDetailModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIconBtn}
              onPress={() => setShowDetailModal(false)}
            >
              <Text style={{ fontSize: 28, color: "#888", fontWeight: "bold" }}>
                ×
              </Text>
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
                    {selectedOrder.receiptAddress}
                  </Text>
                </Text>
                <Text style={styles.infoLabel}>
                  Created At:{" "}
                  <Text style={styles.infoValue}>
                    {selectedOrder.createdAt.toString().split("T")[0]}
                  </Text>
                </Text>
                <Text style={styles.infoLabel}>
                  Delivery fee:
                  <Text style={styles.infoValue}> $5</Text>
                </Text>
              </View>
            )}

            {selectedOrder && (
              <>
                <FlatList
                  data={selectedOrder.OrderItemModels}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  renderItem={({ item }) => (
                    <View style={styles.itemRow}>
                      <Text style={styles.itemName}>
                        {item.ProductModel.name}
                      </Text>
                      <Text style={styles.itemQty}>x{item.quantity}</Text>
                      <Text style={styles.itemPrice}>${item.sumPrice}</Text>
                    </View>
                  )}
                />

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>
                    ${selectedOrder.orderPrice}
                  </Text>
                </View>
              </>
            )}

            <View style={styles.statusLabelRow}>
              <Text style={styles.statusLabel}>Status:</Text>
              <Text
                style={[
                  styles.statusValue,
                  {
                    color:
                      selectedOrder?.status === "Canceled" ? "red" : "green",
                  },
                ]}
              >
                {selectedOrder?.status}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 24,
  },
  content: { padding: 16 },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    height: 38,
    alignItems: "flex-end",
  },
  tabItem: {
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTabItem: {
    borderColor: "#FAD69C",
  },
  tabText: {
    fontSize: 16,
    color: "#888",
  },
  activeTabText: {
    color: "#FAD69C",
    fontWeight: "bold",
  },
  orderList: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderNumber: {
    fontWeight: "500",
    fontSize: 14,
  },
  date: {
    color: "#888",
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  amount: {
    fontWeight: "bold",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  detailButton: {
    backgroundColor: "#FAD69C",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  detailText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  status: {
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
    width: "90%",
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
    alignItems: "center",
    marginBottom: 8,
  },
  itemImage: {
    width: 36,
    height: 36,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: "#f5f5f5",
    resizeMode: "cover",
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
    marginTop: 12,
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
});
