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

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <MainHeader title="Pets" />

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
        data={pets}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 80 }}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Image source={item.image} style={styles.image} />
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/(stack)/item', params: { id: item.id } })}
                style={styles.cartButton}
              >
                <Ionicons name="bag-handle" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.petName}>{item.name}</Text>
            <Text style={styles.petPrice}>{item.price}</Text>
          </View>
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
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  iconWrapper: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 14,
    marginBottom: 6,
  },
  activeIconWrapper: {
    backgroundColor: '#FAD69C', // light yellow
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
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  petName: {
    fontSize: 13,
    fontWeight: '500',
    paddingHorizontal: 8,
    marginTop: 6,
  },
  petPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#003366',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  cartButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#808080',
    borderRadius: 6,
    padding: 6,
    opacity: 0.6,
  },
});
