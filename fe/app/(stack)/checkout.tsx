import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../../components/header';
import AppButton from '../../components/appButton';

export default function CheckoutScreen() {
  const router = useRouter();

  const onPlaceOrderPress = () => {
    router.replace('/order-success');
  };

  const orderTotal = 95;
  const deliveryFee = 5;
  const total = orderTotal + deliveryFee;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Check Out" />

      <View style={styles.content}>
        {/* Shipping Address */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <Ionicons name="create-outline" size={18} color="#6b7280" />
          </View>
          <View style={styles.card}>
            <Text style={styles.bold}>Bruno Fernandes</Text>
            <Text style={styles.gray}>
              25 rue Robert Latouche, Nice, 06200, Côte D'azur, France
            </Text>
          </View>
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Payment</Text>

            <Ionicons name="create-outline" size={18} color="#6b7280" />
          </View>
          <View style={styles.card}>
            <View style={styles.paymentRow}>
              <Ionicons name="card-outline" size={24} color="#111" />
              <Text style={styles.paymentText}>**** **** **** 3947</Text>
            </View>
          </View>
        </View>

        {/* Delivery Method */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Delivery method</Text>

            <Ionicons name="create-outline" size={18} color="#6b7280" />
          </View>
          <View style={styles.card}>
            <View style={styles.deliveryRow}>
              <Image
                source={{ uri: 'https://static.thenounproject.com/png/1077596-200.png' }}
                style={styles.deliveryLogo}
              />
              <Text style={styles.deliveryText}>Fast (2-3 days)</Text>
            </View>
          </View>
        </View>

        {/* Price Summary */}
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
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Submit Button */}
        <AppButton title="SUBMIT ORDER" onPress={() => console.log('SubmitOrder pressed')} />
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
  content: {
    padding: 16,
  },
  section: { 
    marginBottom: 20,
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '500', 
    marginBottom: 6,
  },
  card: {
    padding: 12,
    borderRadius: 10,
  },
  bold: { 
    fontWeight: '600', 
    fontSize: 16,
  },
  gray: { 
    color: '#6b7280', 
    fontSize: 14, 
    marginTop: 4,
  },
  paymentRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10,
  },
  paymentText: { 
    fontSize: 16,
  },
  deliveryRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10,
  },
  deliveryLogo: { 
    width: 40, 
    height: 20, 
    resizeMode: 'contain',
  },
  deliveryText: { 
    fontSize: 15,
  },
  summary: { 
    marginVertical: 20,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { 
    fontSize: 16, 
    fontWeight: '600',
  },
  totalValue: { 
    fontSize: 16, 
    fontWeight: '600',
  },
});
