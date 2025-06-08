import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock data for chat list
const chatList = [
  {
    id: '1',
    productName: 'Alaskan Malamute Grey',
    lastMessage: 'Xin chào! Bạn cần tư vấn gì?',
    time: '10:30 AM',
    productImage: require('../../assets/dog1.png'),
  },
  {
    id: '2',
    productName: 'Poodle Tiny Dairy Cow',
    lastMessage: 'Cảm ơn bạn đã quan tâm!',
    time: 'Yesterday',
    productImage: require('../../assets/dog2.png'),
  },
  {
    id: '3',
    productName: 'Pomeranian White',
    lastMessage: 'Sản phẩm còn hàng không?',
    time: '2 days ago',
    productImage: require('../../assets/dog3.png'),
  },
];

export default function ChatListScreen() {
  const router = useRouter();

  const renderChatItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push({ pathname: '/chat', params: { id: item.id } })}
    >
      <Image source={item.productImage} style={styles.productImage} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>
      <FlatList
        data={chatList}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003459',
  },
  listContainer: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003459',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
}); 