import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ListRenderItemInfo,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import MainHeader from '../../components/mainHeader';
import AppButton from '../../components/appButton';

type Pet = {
  id: string;
  name: string;
  price: number;
  image: string;
};

const initialPets: Pet[] = [
  { id: '1', name: 'Poodle Tiny Dairy Cow', price: 50.0, image: 'https://placedog.net/300/200?id=1' },
  { id: '2', name: 'Alaskan Malamute Grey', price: 20.0, image: 'https://placedog.net/300/200?id=2' },
  { id: '3', name: 'Pomeranian White', price: 25.0, image: 'https://placedog.net/300/200?id=3' },
  { id: '4', name: 'Pembroke Corgi Cream', price: 50.0, image: 'https://placedog.net/300/200?id=4' },
  { id: '5', name: 'Alaskan Malamute Grey', price: 12.0, image: 'https://placedog.net/300/200?id=5' },
];

const FavoritesScreen: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [cart, setCart] = useState<Pet[]>([]);

  const router = useRouter();

  // Remove pet from favorites
  const handleRemove = (id: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id));
  };

  // Add pet to cart (if not already added)
  const handleAddToCart = (pet: Pet) => {
    setCart((prev) => {
      if (prev.find((p) => p.id === pet.id)) return prev; // already in cart
      return [...prev, pet];
    });
  };

  // Add all pets to cart
  const handleAddAllToCart = () => {
    setCart((prev) => {
      const newPets = pets.filter((p) => !prev.find((cp) => cp.id === p.id));
      return [...prev, ...newPets];
    });
    router.push('/cart');
  };

  const renderItem = ({ item }: ListRenderItemInfo<Pet>) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleRemove(item.id)}>
          <Feather name="x-circle" size={18} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleAddToCart(item)}>
          <Ionicons name="bag" size={18} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader title="Favorites" />
      <View style={styles.content}>
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text>No favorites found.</Text>}
        />

        <AppButton title="Add all to My Cart" onPress={handleAddAllToCart} href={''} />
      </View>
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 24
  },
  content: { padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    elevation: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    color: '#333',
    fontSize: 13,
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 6,
  },
});
