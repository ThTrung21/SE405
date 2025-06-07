import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Header from '../../components/header';

type ReviewItem = {
  id: string;
  image: string;
  title: string;
  price: string;
  date: string;
  rating: number;
  review: string;
};

const reviews: ReviewItem[] = [
  {
    id: '1',
    image: 'https://static.thenounproject.com/png/1077596-200.png', // Replace with `require` if local image
    title: 'Coffee Table',
    price: '$ 50.00',
    date: '20/03/2020',
    rating: 5,
    review:
      'Nice Furniture with good delivery. The delivery time is very fast. Then products look like exactly the picture in the app. Besides, color is also the same and quality is very good despite very cheap price',
  },
  {
    id: '2',
    image: 'https://static.thenounproject.com/png/1077596-200.png',
    title: 'Coffee Table',
    price: '$ 50.00',
    date: '20/03/2020',
    rating: 5,
    review:
      'Nice Furniture with good delivery. The delivery time is very fast. Then products look like exactly the picture in the app. Besides, color is also the same and quality is very good despite very cheap price',
  },
  {
    id: '3',
    image: 'https://static.thenounproject.com/png/1077596-200.png',
    title: 'Coffee Table',
    price: '$ 50.00',
    date: '20/03/2020',
    rating: 5,
    review:
      'Nice Furniture with good delivery. The delivery time is very fast. Then products look like exactly the picture in the app. Besides, color is also the same and quality is very good despite very cheap price',
  },
  {
    id: '4',
    image: 'https://static.thenounproject.com/png/1077596-200.png',
    title: 'Coffee Table',
    price: '$ 50.00',
    date: '20/03/2020',
    rating: 5,
    review:
      'Nice Furniture with good delivery. The delivery time is very fast. Then products look like exactly the picture in the app. Besides, color is also the same and quality is very good despite very cheap price',
  },
  {
    id: '5',
    image: 'https://static.thenounproject.com/png/1077596-200.png',
    title: 'Coffee Table',
    price: '$ 50.00',
    date: '20/03/2020',
    rating: 5,
    review:
      'Nice Furniture with good delivery. The delivery time is very fast. Then products look like exactly the picture in the app. Besides, color is also the same and quality is very good despite very cheap price',
  },
];

const MyReviewsScreen: React.FC = () => {
  const renderStars = (count: number) => (
    <View style={styles.stars}>
      {Array.from({ length: count }).map((_, index) => (
        <FontAwesome key={index} name="star" size={16} color="#f1c40f" />
      ))}
    </View>
  );

  const renderItem: ListRenderItem<ReviewItem> = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      {renderStars(item.rating)}
      <Text style={styles.review}>{item.review}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Check Out" />
      <View style={styles.content}>
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default MyReviewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 24
  },
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  title: {
    fontStyle: 'italic',
    fontSize: 16,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  review: {
    fontSize: 14,
    color: '#444',
  },
});
