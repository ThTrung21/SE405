import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Use the same petData as in item.tsx
const petData = [
  {
    id: '1',
    name: 'Alaskan Malamute Grey',
    price: 12,
    image: require('../../assets/dog1.png'),
  },
  {
    id: '2',
    name: 'Poodle Tiny Dairy Cow',
    price: 25,
    image: require('../../assets/dog2.png'),
  },
  {
    id: '3',
    name: 'Pomeranian White',
    price: 20,
    image: require('../../assets/dog3.png'),
  },
  {
    id: '4',
    name: 'Pomeranian White',
    price: 50,
    image: require('../../assets/dog4.png'),
  },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const currentProduct = petData.find(p => p.id === id) || petData[0];
  const [messages, setMessages] = useState([
    { id: '1', type: 'text', text: 'Xin chào! Bạn cần tư vấn gì?', sender: 'other' },
    { id: '2', type: 'product', product: currentProduct, sender: 'other' },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const sendMessage = () => {
    if (input.trim() === '') return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: 'text', text: input, sender: 'me' },
    ]);
    setInput('');
    scrollToEnd();
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: any) => {
    if (item.type === 'text') {
      return (
        <View style={[styles.bubble, item.sender === 'me' ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={styles.bubbleText}>{item.text}</Text>
        </View>
      );
    }
    if (item.type === 'product') {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: '/item', params: { id: item.product.id } })}
          style={[styles.productCard, item.sender === 'me' ? styles.bubbleMe : styles.bubbleOther]}
        >
          <Image source={item.product.image} style={styles.productImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.productName}>{item.product.name}</Text>
            <Text style={styles.productPrice}>${item.product.price}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#f9f9f9' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#003459" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={scrollToEnd}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.iconBtn}>
          <Ionicons name="send" size={28} color="#FFA500" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003459',
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  bubbleMe: {
    backgroundColor: '#FFA50022',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  bubbleText: {
    fontSize: 16,
    color: '#222',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003459',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    color: '#222',
  },
  iconBtn: {
    padding: 4,
  },
}); 