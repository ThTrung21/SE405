import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from '../../components/header';
import AppButton from '../../components/appButton';

const initialCartItems = [
  {
    id: '1',
    name: 'Poodle Tiny Dairy Cow',
    price: 25,
    image: require('../../assets/dog1.png'),
    quantity: 1,
  },
  {
    id: '2',
    name: 'Pomeranian White',
    price: 20,
    image: require('../../assets/dog2.png'),
    quantity: 1,
  },
  {
    id: '3',
    name: 'Alaskan Malamute Grey',
    price: 50,
    image: require('../../assets/dog3.png'),
    quantity: 1,
  },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');

  const updateQuantity = (id: string, amount: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header title="My Cart" />

      <FlatList
        style={{ padding: 20 }}
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={item.image} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <View style={styles.quantityRow}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
                <Text style={styles.quantityText}>
                  {item.quantity.toString().padStart(2, '0')}
                </Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Ionicons
                name="close-circle-outline"
                size={24}
                color="#6b7280"
              />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.bottomContainer}>
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

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>

        {/* Checkout */}
        <AppButton title="Check Out" href='checkout' />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 24
  },
  bottomContainer: {
    marginBottom: 24,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '500',
  },
  price: {
    fontSize: 14,
    color: '#10b981',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 10,
  },
  quantityText: {
    fontSize: 16,
    width: 36,
    textAlign: 'center',
  },
  promoRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 16,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  promoButton: {
    backgroundColor: '#003459',
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
  },
});
