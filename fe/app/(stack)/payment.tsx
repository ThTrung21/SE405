import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/header';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';

type Card = {
  id: number;
  type: string;
  last4: string;
  holder: string;
  expiry: string;
  default: boolean;
  backgroundColor: string;
  logo?: string; // Optional in case you add card logos later
};

const cards: Card[] = [
  {
    id: 1,
    type: 'Mastercard',
    last4: '3947',
    holder: 'Jennyfer Doe',
    expiry: '05/23',
    default: true,
    backgroundColor: '#003366',
  },
  {
    id: 2,
    type: 'Visa',
    last4: '3947',
    holder: 'Jennyfer Doe',
    expiry: '05/23',
    default: false,
    backgroundColor: '#999999',
  },
];

export default function PaymentMethodScreen() {
  const [defaultCard, setDefaultCard] = useState<number>(1);
  const router = useRouter();

  const onAddPress = () => {
    router.push('/(stack)/addPayment');
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Payment Methods" />
      <View style={styles.content}>
        {cards.map((card) => {
          const isSelected = defaultCard === card.id;
          return (
            <View key={card.id} style={{ marginBottom: 24 }}>
              <View
                style={[
                  styles.card,
                  isSelected && styles.selectedCard,
                  { backgroundColor: isSelected ? '#003459' : '#ccc' },
                ]}
              >
                {card.logo ? (
                  <Image source={{ uri: card.logo }} />
                ) : (
                  <Text style={[styles.cardLogo, { fontWeight: 'bold' }]}>{card.type}</Text>
                )}
                <Text style={[styles.cardNumber, isSelected && { color: '#fff' }]}>
                  **** **** **** {card.last4}
                </Text>
                <View style={styles.cardRow}>
                  <Text style={[styles.cardLabel, isSelected && { color: '#eee' }]}>
                    Card Holder Name
                  </Text>
                  <Text style={[styles.cardLabel, isSelected && { color: '#eee' }]}>
                    Expiry Date
                  </Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={[styles.cardInfoValue, isSelected && { color: '#fff' }]}>
                    {card.holder}
                  </Text>
                  <Text style={[styles.cardInfoValue, isSelected && { color: '#fff' }]}>
                    {card.expiry}
                  </Text>
                </View>
              </View>
              <View style={styles.checkboxRowOuter}>
                <Checkbox
                  value={isSelected}
                  onValueChange={() => setDefaultCard(card.id)}
                  color={isSelected ? '#003087' : undefined}
                />
                <Text style={styles.checkboxLabelOuter}>Use as default payment method</Text>
              </View>
            </View>
          );
        })}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingVertical: 24
  },
  content: { padding: 16 },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
  },
  selectedCard: {
    // Extra styling if needed for selected card
  },
  cardLogo: {
    fontSize: 18,
    color: '#fff',
  },
  cardNumber: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 10,
    letterSpacing: 2,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cardLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.6,
  },
  cardInfoValue: {
    color: '#fff',
    fontSize: 14,
  },
  checkboxRowOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxLabelOuter: {
    marginLeft: 8,
    fontSize: 14,
    color: '#003459',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#003459',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
