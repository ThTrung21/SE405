import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, Link, useRouter } from 'expo-router';

import FavoriteButton from '../../components/favoriteButton';
import Header from '../../components/header';
import AppButton from '../../components/appButton';
import { ImageSlider } from '../../components/ImageSlider';

const petData = [
  {
    id: '1',
    name: 'Alaskan Malamute Grey',
    price: 12,
    images: [
      require('../../assets/dog1.png'),
      require('../../assets/dog2.png'),
      require('../../assets/dog3.png'),
      require('../../assets/dog4.png'),
    ],
    description: 'Strong and friendly dog, perfect for cold climates.',
    rating: 4.5,
    reviews: 50,
  },
  {
    id: '2',
    name: 'Poodle Tiny Dairy Cow',
    price: 25,
    images: [
      require('../../assets/dog2.png'),
      require('../../assets/dog1.png'),
      require('../../assets/dog3.png'),
      require('../../assets/dog4.png'),
    ],
    description: 'Smart and active, great companion for families.',
    rating: 4.8,
    reviews: 80,
  },
  {
    id: '3',
    name: 'Pomeranian White',
    price: 20,
    images: [
      require('../../assets/dog3.png'),
      require('../../assets/dog1.png'),
      require('../../assets/dog2.png'),
      require('../../assets/dog4.png'),
    ],
    description: 'Cute and fluffy, very playful and loving.',
    rating: 4.2,
    reviews: 40,
  },
  {
    id: '4',
    name: 'Pomeranian White',
    price: 50,
    images: [
      require('../../assets/dog4.png'),
      require('../../assets/dog1.png'),
      require('../../assets/dog2.png'),
      require('../../assets/dog3.png'),
    ],
    description: 'Rare breed, charming and loyal companion.',
    rating: 4.9,
    reviews: 60,
  },
];

export default function Item() {
  const { id } = useLocalSearchParams();
  const pet = petData.find((p) => p.id === id);
  const router = useRouter();
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Header title="Product Details" />
      <View style={styles.card}>
        {/* Pet Images Slider */}
        <ImageSlider images={pet.images} />

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

          {/* Need Advice Button */}
          <TouchableOpacity 
            style={styles.adviceButton} 
            onPress={() => router.push({ pathname: '/chat', params: { id: pet.id } })}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#FFA500" />
            <Text style={styles.adviceButtonText}>Need advice?</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {/* Add to Favorites */}
            <FavoriteButton initialFavorite={false} onToggle={handleFavoriteChange} />
            {/* Add to Cart Button */}
            <AppButton 
              title="Add to cart" 
              onPress={() => {
                // TODO: Implement add to cart functionality
                console.log('Adding to cart:', { id: pet.id, quantity });
                // Show success message or update cart state
              }} 
            />
          </View>
        </View>
      </View>

      {/* Related Products Section */}
      <View style={styles.relatedSection}>
        <Text style={styles.relatedTitle}>Related Products</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={petData.filter(p => p.id !== pet.id)}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.relatedItem}
              onPress={() => router.push({ pathname: '/item', params: { id: item.id } })}
            >
              <Image source={item.images[0]} style={styles.relatedImage} />
              <Text style={styles.relatedName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.relatedPrice}>${item.price}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.relatedList}
        />
      </View>
    </ScrollView>
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
  adviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA50022',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  adviceButtonText: {
    color: '#FFA500',
    fontWeight: '600',
    fontSize: 16,
  },
  relatedSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 16,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003459',
    marginBottom: 12,
  },
  relatedList: {
    paddingRight: 16,
  },
  relatedItem: {
    width: 160,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  relatedImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  relatedName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#003459',
    marginBottom: 4,
  },
  relatedPrice: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: '600',
  },
});
