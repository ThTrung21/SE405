import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ListRenderItem,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/header';
import { useRouter } from 'expo-router';

type Address = {
  id: number;
  name: string;
  address: string;
};

const addresses: Address[] = [
  {
    id: 1,
    name: 'Bruno Fernandes',
    address: '25 rue Robert Latouche, Nice, 06200, Côte D’azur, France',
  },
  {
    id: 2,
    name: 'Bruno Fernandes',
    address: '25 rue Robert Latouche, Nice, 06200, Côte D’azur, France',
  },
  {
    id: 3,
    name: 'Bruno Fernandes',
    address: '25 rue Robert Latouche, Nice, 06200, Côte D’azur, France',
  },
];

const ShippingAddressScreen: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number>(1);
  const router = useRouter();

  const onAddPress = () => {
    router.push('/(stack)/addAddress');
  };

  const renderItem: ListRenderItem<Address> = ({ item }) => {
    const isSelected = item.id === selectedId;

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => setSelectedId(item.id)} style={styles.checkbox}>
            {isSelected && <View style={styles.checked} />}
          </TouchableOpacity>
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.address}>{item.address}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="pencil-outline" size={20} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Shipping Addresses" />
      <View style={styles.content}>
        <FlatList
          data={addresses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
        <TouchableOpacity style={styles.fab} onPress={onAddPress}>
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ShippingAddressScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    paddingVertical: 24
  },
  content: { padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    height: 22,
    width: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: '#003459',
    borderRadius: 2,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  address: {
    color: '#555',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#003459',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
