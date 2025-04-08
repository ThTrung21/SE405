import React, { JSX } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Header from '../../components/header';

type Review = {
  id: number;
  name: string;
  date: string;
  avatar: ImageSourcePropType;
  rating: number;
  content: string;
};

const reviews: Review[] = [
  {
    id: 1,
    name: 'Bruno Fernandes',
    date: '20/03/2020',
    avatar: require('../../assets/default_avatar.jpg'),
    rating: 5,
    content:
      'Nice Furniture with good delivery. The delivery time is very fast. Then products look like exactly the picture in the app. Besides, color is also the same and quality is very good despite very cheap price',
  },
  {
    id: 2,
    name: 'Tracy Mosby',
    date: '20/03/2020',
    avatar: require('../../assets/default_avatar.jpg'),
    rating: 5,
    content:
      'Nice Furniture with good delivery. The delivery time is very fast. Then products look like exactly the picture in the app. Besides, color is also the same and quality is very good despite very cheap price',
  },
  {
    id: 3,
    name: 'Tracy Mosby',
    date: '20/03/2020',
    avatar: require('../../assets/default_avatar.jpg'),
    rating: 5,
    content:
      'Nice Furniture with good delivery. The delivery time is very fast. Then products look like exactly the picture in the app. Besides, color is also the same and quality is very good despite very cheap price',
  },
  {
    id: 4,
    name: 'Tracy Mosby',
    date: '20/03/2020',
    avatar: require('../../assets/default_avatar.jpg'),
    rating: 5,
    content:
      'Nice Furniture with good delivery. The delivery time is very fast. Then products look like exactly the picture in the app. Besides, color is also the same and quality is very good despite very cheap price',
  },
];

export default function ReviewScreen(): JSX.Element {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Header title="Ratings and Reviews" />
      <View style={styles.content}>
        <View style={styles.summary}>
          <Image source={require('../../assets/dog4.png')} style={styles.productImage} />
          <View>
            <Text style={styles.productTitle}>Minimal Stand</Text>
            <View style={styles.ratingRow}>
              <AntDesign name="star" size={16} color="#F5A623" />
              <Text style={styles.ratingText}>4.5</Text>
            </View>
            <Text style={styles.reviewCount}>10 reviews</Text>
          </View>
        </View>

        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={review.avatar} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{review.name}</Text>
                <View style={styles.stars}>
                  {[...Array(review.rating)].map((_, i) => (
                    <AntDesign key={`star-${review.id}-${i}`} name="star" size={14} color="#F5A623" />
                  ))}
                </View>
              </View>
              <Text style={styles.date}>{review.date}</Text>
            </View>
            <Text style={styles.reviewText}>{review.content}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Write a review</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    paddingVertical: 24
  },
  content: { padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  summary: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  productImage: { width: 70, height: 70, borderRadius: 8, marginRight: 16 },
  productTitle: { fontSize: 16, fontWeight: 'bold' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { marginLeft: 4, fontSize: 16 },
  reviewCount: { color: '#888', fontSize: 12 },
  reviewCard: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  name: { fontWeight: 'bold', fontSize: 14 },
  stars: { flexDirection: 'row', marginTop: 2 },
  date: { fontSize: 12, color: '#888' },
  reviewText: { fontSize: 13, color: '#333', marginTop: 8 },
  button: {
    backgroundColor: '#002D5C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
