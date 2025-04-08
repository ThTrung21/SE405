import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, Link } from 'expo-router';

import FavoriteButton from '../../components/favoriteButton';
import Header from '../../components/header';
import AppButton from '../../components/appButton';

const petData = [
  {
    id: '1',
    name: 'Alaskan Malamute Grey',
    price: 12,
    image: require('../../assets/dog1.png'),
    description: 'Strong and friendly dog, perfect for cold climates.',
    rating: 4.5,
    reviews: 50,
  },
  {
    id: '2',
    name: 'Poodle Tiny Dairy Cow',
    price: 25,
    image: require('../../assets/dog2.png'),
    description: 'Smart and active, great companion for families.',
    rating: 4.8,
    reviews: 80,
  },
  {
    id: '3',
    name: 'Pomeranian White',
    price: 20,
    image: require('../../assets/dog3.png'),
    description: 'Cute and fluffy, very playful and loving.',
    rating: 4.2,
    reviews: 40,
  },
  {
    id: '4',
    name: 'Pomeranian White',
    price: 50,
    image: require('../../assets/dog4.png'),
    description: 'Rare breed, charming and loyal companion.',
    rating: 4.9,
    reviews: 60,
  },
];

export default function Item() {
  const { id } = useLocalSearchParams(); // get id from route params
  const pet = petData.find((p) => p.id === id);

  const [quantity, setQuantity] = useState(1);

  const handleFavoriteChange = (fav: any) => {
    console.log('Is favorite:', fav);
  };

  if (!pet) {
    return (
      <View style={styles.center}>
        <Text>Pet not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Pet Details" />
      <View style={styles.card}>
        {/* Pet Image */}
        <Image source={pet.image} style={styles.image} />

        {/* Product Info */}
        <View style={styles.info}>
          <Text style={styles.title}>{pet.name}</Text>
          <Text style={styles.price}>${pet.price.toFixed(2)}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#facc15" />
            <Text style={styles.ratingText}>{pet.rating} </Text>
            <Link href="/review">
              <Text style={styles.reviewCount}>({pet.reviews} reviews)</Text>
            </Link>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantityRow}>
            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <Ionicons name="remove-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity.toString().padStart(2, '0')}</Text>
            <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
              <Ionicons name="add-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.description}>{pet.description}</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {/* Add to Favorites */}
            <FavoriteButton initialFavorite={false} onToggle={handleFavoriteChange} />
            {/* Add to Cart Button */}
            <AppButton title="Add to cart" onPress={() => console.log('AddToCart pressed')} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 24
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    margin: 16,
  },
  image: {
    width: '100%',
    maxHeight: 400,
    resizeMode: 'cover',
  },
  info: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    color: '#10b981',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  reviewCount: {
    marginLeft: 8,
    color: '#6b7280',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 10,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '500',
    width: 40,
    textAlign: 'center',
  },
  description: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1e40af',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
