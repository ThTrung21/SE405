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
  TextInput,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredPets = pets.filter(pet => pet.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
      {/* Header with Search and Cart */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => setShowSearch((prev) => !prev)}>
          <Ionicons name="search" size={28} color="#003459" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrapper}>
          {showSearch ? (
            <TextInput
              style={styles.headerSearchInput}
              placeholder="Search favorites..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          ) : (
            <Text style={styles.headerTitle}>Favorites</Text>
          )}
        </View>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/(stack)/cart')}>
          <Ionicons name="cart-outline" size={28} color="#003459" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <FlatList
          data={filteredPets}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerIcon: {
    padding: 8,
  },
  headerTitleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003459',
  },
  headerSearchInput: {
    fontSize: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: '100%',
    color: '#003459',
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
