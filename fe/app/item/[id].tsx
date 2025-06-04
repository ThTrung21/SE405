import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ImageSlider } from '../../components/ImageSlider';

// Mock data - thay thế bằng dữ liệu thực từ API
const mockProduct = {
  id: '1',
  name: 'Sản phẩm mẫu',
  price: '1.000.000đ',
  description: 'Mô tả chi tiết về sản phẩm...',
  images: [
    'https://via.placeholder.com/400',
    'https://via.placeholder.com/400',
    'https://via.placeholder.com/400',
    'https://via.placeholder.com/400',
  ],
};

export default function ItemScreen() {
  const { id } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      <ImageSlider images={mockProduct.images} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.price}>{mockProduct.price}</Text>
        <Text style={styles.name}>{mockProduct.name}</Text>
        <Text style={styles.description}>{mockProduct.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  infoContainer: {
    padding: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4d4d',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 