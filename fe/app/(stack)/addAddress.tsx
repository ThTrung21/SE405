import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/header';
import AppButton from '../../components/appButton';

type FormState = {
  fullName: string;
  address: string;
  zipcode: string;
  country: string;
  city: string;
  district: string;
};

const AddShippingAddress: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    address: '',
    zipcode: '',
    country: '',
    city: '',
    district: '',
  });

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Add Shipping Address" />
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Ex: Bruno Pham"
            value={form.fullName}
            onChangeText={(text) => handleChange('fullName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Ex: 25 Robert Latouche Street"
            value={form.address}
            onChangeText={(text) => handleChange('address', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Zipcode (Postal Code)"
            value={form.zipcode}
            onChangeText={(text) => handleChange('zipcode', text)}
          />
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>
              {form.country || 'Select Country'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>
              {form.city || 'Select City'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>
              {form.district || 'Select District'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          <AppButton title="sAVE ADDRESS" onPress={() => console.log('SaveAddress pressed')} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddShippingAddress;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    paddingVertical: 24 },
  content: { padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  form: {
    paddingBottom: 40,
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
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownText: {
    fontSize: 16,
    color: '#444',
  },
  button: {
    backgroundColor: '#002f5f',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
