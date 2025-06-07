import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Header from '../../components/header';

type Order = {
  id: string;
  number: string;
  quantity: number;
  amount: number;
  date: string;
  status: string;
};

const orders: Order[] = [
  {
    id: '1',
    number: 'No238562312',
    quantity: 3,
    amount: 150,
    date: '20/03/2020',
    status: 'Delivered',
  },
  {
    id: '2',
    number: 'No238562312',
    quantity: 3,
    amount: 150,
    date: '20/03/2020',
    status: 'Delivered',
  },
  {
    id: '3',
    number: 'No238562312',
    quantity: 3,
    amount: 150,
    date: '20/03/2020',
    status: 'Delivered',
  },
];

const tabs: string[] = ['Delivered', 'Processing', 'Canceled'];

export default function MyOrderScreen() {
  const [activeTab, setActiveTab] = useState<string>('Delivered');

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
                  <TouchableOpacity style={styles.detailButton}>
                    <Text style={styles.detailText}>Detail</Text>
                  </TouchableOpacity>
                  <Text style={[styles.status, order.status === 'Canceled' ? {color: 'red'} : {color: 'green'}]}>
                    {order.status}
                  </Text>
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
    marginBottom: 20,
  },
  tabItem: {
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTabItem: {
    borderColor: '#F5A623',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#000',
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
    backgroundColor: '#003459',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  detailText: {
    color: '#fff',
    fontSize: 14,
  },
  status: {
    fontWeight: '500',
  },
});
