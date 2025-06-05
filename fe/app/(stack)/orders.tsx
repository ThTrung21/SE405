import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import Header from '../../components/header';

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

const orders: Order[] = [
  {
    id: '1',
    number: 'No238562312',
    quantity: 3,
    amount: 150,
    date: '20/03/2020',
    status: 'Delivered',
    items: [
      { name: 'Dog Food', quantity: 2, price: 30, image: require('../../assets/dog1.png') },
      { name: 'Cat Toy', quantity: 1, price: 20, image: require('../../assets/cat1.png') },
      { name: 'Bird Cage', quantity: 1, price: 70, image: require('../../assets/bird1.png') },
    ],
  },
  {
    id: '2',
    number: 'No238562312',
    quantity: 3,
    amount: 150,
    date: '20/03/2020',
    status: 'Delivered',
    items: [
      { name: 'Cat Food', quantity: 2, price: 20, image: require('../../assets/cat1.png') },
      { name: 'Dog Toy', quantity: 2, price: 20, image: require('../../assets/dog2.png') },
    ],
  },
  {
    id: '3',
    number: 'No238562312',
    quantity: 3,
    amount: 150,
    date: '20/03/2020',
    status: 'Delivered',
    items: [
      { name: 'Hamster Wheel', quantity: 1, price: 50, image: require('../../assets/hamster1.png') },
    ],
  },
];

const tabs: string[] = ['Delivered', 'Processing', 'Canceled'];

export default function MyOrderScreen() {
  const [activeTab, setActiveTab] = useState<string>('Delivered');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter orders by active tab if needed:
  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <View style={styles.container}>
      <Header title="My Orders" />
      <View style={styles.content}>
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.orderList}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <View key={order.id} style={styles.card}>
                <View style={styles.cardRow}>
                  {order.items && order.items[0] && (
                    <Image source={order.items[0].image} style={styles.orderImage} />
                  )}
                  <View style={{ flex: 1 }}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.orderNumber}>Order {order.number}</Text>
                      <Text style={styles.date}>{order.date}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.text}>Quantity: {order.quantity.toString().padStart(2, '0')}</Text>
                      <Text style={styles.text}>
                        Total Amount: <Text style={styles.amount}>${order.amount}</Text>
                      </Text>
                    </View>
                    <View style={styles.cardFooter}>
                      <TouchableOpacity style={styles.detailButton} onPress={() => { setSelectedOrder(order); setShowDetailModal(true); }}>
                        <Text style={styles.detailText}>Detail</Text>
                      </TouchableOpacity>
                      <Text style={[styles.status, order.status === 'Canceled' ? {color: 'red'} : {color: 'green'}]}>
                        {order.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
              No orders in "{activeTab}" status.
            </Text>
          )}
        </ScrollView>
      </View>

      {/* Modal chi tiết order giống Order Manage, chỉ có nút X */}
      <Modal visible={showDetailModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIconBtn} onPress={() => setShowDetailModal(false)}>
              <Text style={{ fontSize: 28, color: '#888', fontWeight: 'bold' }}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Order Details</Text>
            {selectedOrder && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Customer Name: <Text style={styles.infoValue}>John Doe</Text></Text>
                <Text style={styles.infoLabel}>Phone: <Text style={styles.infoValue}>0123456789</Text></Text>
                <Text style={styles.infoLabel}>Address: <Text style={styles.infoValue}>123 Main St, District 1, HCMC</Text></Text>
                <Text style={styles.infoLabel}>Created At: <Text style={styles.infoValue}>20/03/2020 10:00</Text></Text>
                <Text style={styles.infoLabel}>Updated At: <Text style={styles.infoValue}>20/03/2020 12:00</Text></Text>
              </View>
            )}
            {selectedOrder && (
              <View style={styles.itemsList}>
                {selectedOrder.items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Image source={item.image} style={styles.itemImage} />
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQty}>x{item.quantity}</Text>
                    <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                ))}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>${selectedOrder.amount.toFixed(2)}</Text>
                </View>
              </View>
            )}
            <View style={styles.statusLabelRow}>
              <Text style={styles.statusLabel}>Status:</Text>
              <Text style={[styles.statusValue, { color: selectedOrder?.status === 'Canceled' ? 'red' : 'green' }]}>{selectedOrder?.status}</Text>
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
    backgroundColor: '#fff',
    paddingVertical: 24
  },
  content: { padding: 16 },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    height: 38,
    alignItems: 'flex-end',
  },
  tabItem: {
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTabItem: {
    borderColor: '#FAD69C',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#FAD69C',
    fontWeight: 'bold',
  },
  orderList: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderNumber: {
    fontWeight: '500',
    fontSize: 14,
  },
  date: {
    color: '#888',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  amount: {
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  detailButton: {
    backgroundColor: '#FAD69C',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  detailText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  status: {
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    position: 'relative',
  },
  closeIconBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 18,
    textAlign: 'center',
  },
  infoBlock: {
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: '#003459',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  infoValue: {
    fontWeight: 'normal',
    color: '#333',
  },
  itemsList: {
    marginBottom: 18,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemImage: {
    width: 36,
    height: 36,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
    resizeMode: 'cover',
  },
  itemName: {
    fontSize: 17,
    color: '#222',
    fontWeight: '500',
    flex: 1,
  },
  itemQty: {
    fontSize: 17,
    color: '#003459',
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  itemPrice: {
    fontSize: 17,
    color: '#E57373',
    fontWeight: 'bold',
    minWidth: 70,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003459',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003459',
  },
  statusLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 6,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
