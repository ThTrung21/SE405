import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import MainHeader from '../../components/mainHeader';

type Category = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
};

const categories: Category[] = [
  { label: 'Popular', icon: 'star-outline', activeIcon: 'star' },
  { label: 'Pets', icon: 'paw-outline', activeIcon: 'paw' },
  { label: 'Proteine', icon: 'restaurant-outline', activeIcon: 'restaurant' },
  { label: 'Biscuit', icon: 'pizza-outline', activeIcon: 'pizza' },
  { label: 'Small', icon: 'pricetag-outline', activeIcon: 'pricetag' },
  { label: 'Large', icon: 'pricetags-outline', activeIcon: 'pricetags' },
];

type Pet = {
  id: string;
  name: string;
  price: string;
  image: ImageSourcePropType;
};

const pets: Pet[] = [
  {
    id: '1',
    name: 'Alaskan Malamute Grey',
    price: '$ 12.00',
    image: require('../../assets/dog1.png'),
  },
  {
    id: '2',
    name: 'Poodle Tiny Dairy Cow',
    price: '$ 25.00',
    image: require('../../assets/dog2.png'),
  },
  {
    id: '3',
    name: 'Pomeranian White',
    price: '$ 20.00',
    image: require('../../assets/dog3.png'),
  },
  {
    id: '4',
    name: 'Pomeranian White',
    price: '$ 50.00',
    image: require('../../assets/dog4.png'),
  },
];

export default function Homepage() {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar: Cart Icon and Explore Title */}
      <View style={styles.topBar}>
        <Text style={styles.exploreTitle}>Explore</Text>
        <TouchableOpacity style={styles.cartIcon} onPress={() => router.push('/(stack)/cart')}>
          <Ionicons name="cart-outline" size={28} color="#003459" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={22} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Find best item for your pet"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Discount Banner (moved above category) */}
      <View style={styles.bannerContainer}>
        <Image
          source={require('../../assets/discount-banner.png')}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((item, index) => {
          const isActive = index === selectedCategoryIndex;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.categoryItem]}
              onPress={() => setSelectedCategoryIndex(index)}
            >
              <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
                <Ionicons
                  name={isActive ? item.activeIcon : item.icon}
                  size={28}
                  color={isActive ? '#000' : '#555'}
                />
              </View>
              <Text style={[styles.categoryLabel, isActive && styles.activeLabel]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Pet Grid */}
      <FlatList
        data={filteredPets}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 100 }}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        style={styles.petGrid}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push({ pathname: '/(stack)/item', params: { id: item.id } })}
          >
            <Image source={item.image} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.petName}>{item.name}</Text>
              <Text style={styles.petPrice}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 24
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12,
    minHeight: 40,
  },
  exploreTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003459',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'System',
  },
  cartIcon: {
    position: 'absolute',
    right: 24,
    top: 0,
    padding: 4,
    zIndex: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    height: 52,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    fontFamily: 'System',
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
  },
  bannerImage: {
    width: '100%',
    height: 120,
    borderRadius: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    paddingBottom: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    paddingBottom: 6,
  },
  iconWrapper: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 14,
  },
  activeIconWrapper: {
    backgroundColor: '#FAD69C',
  },
  categoryLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#000',
    fontWeight: 'bold',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  petName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  petPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#003366',
  },
  petGrid: {
    marginTop: 8,
  },
});
