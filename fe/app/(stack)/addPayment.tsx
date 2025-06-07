import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/header';
import AppButton from '../../components/appButton';

type PaymentForm = {
  cardHolderName: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
};

const AddPaymentMethod: React.FC = () => {
  const [form, setForm] = useState<PaymentForm>({
    cardHolderName: '',
    cardNumber: '',
    cvv: '',
    expiryDate: '',
  });

  const handleChange = (key: keyof PaymentForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Add Payment Methods" />
      <View style={styles.content}>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.cardPreview}>
            <View style={styles.cardLogos}>
              <Text style={styles.mastercard}>●</Text>
              <Text style={styles.visa}>VISA</Text>
            </View>
            <Text style={styles.cardNumber}>**** **** **** XXXX</Text>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>Card Holder Name</Text>
                <Text style={styles.cardValue}>XXXXXX</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>Expiry Date</Text>
                <Text style={styles.cardValue}>XX/XX</Text>
              </View>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Ex: Bruno Pham"
            value={form.cardHolderName}
            onChangeText={(text) => handleChange('cardHolderName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="**** **** **** 3456"
            keyboardType="numeric"
            value={form.cardNumber}
            onChangeText={(text) => handleChange('cardNumber', text)}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              placeholder="Ex: 123"
              keyboardType="numeric"
              value={form.cvv}
              onChangeText={(text) => handleChange('cvv', text)}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="03/22"
              value={form.expiryDate}
              onChangeText={(text) => handleChange('expiryDate', text)}
            />
          </View>

          <AppButton title="ADD NEW CARD" onPress={() => console.log('AddNewCard pressed')} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddPaymentMethod;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    paddingVertical: 24
  },
  content: { padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardPreview: {
    backgroundColor: '#002f5f',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardLogos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mastercard: {
    fontSize: 24,
    color: '#ff5f00',
  },
  visa: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardNumber: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  cardValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#ddd',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#666',
  },
});
