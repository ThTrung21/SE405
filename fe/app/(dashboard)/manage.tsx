import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../../components/header';
import Colors from '../../constants/Colors';

const ManagementOption = ({ title, icon, onPress, active }: { title: string; icon: string; onPress: () => void; active?: boolean }) => (
  <TouchableOpacity style={[styles.option, active && styles.activeOption]} onPress={onPress}>
    <View style={[styles.iconContainer, active && styles.activeIconContainer]}>
      <Ionicons name={icon as any} size={24} color={active ? '#fff' : '#003459'} />
    </View>
    <Text style={[styles.optionText, active && styles.activeOptionText]}>{title}</Text>
    <Ionicons name="chevron-forward" size={20} color="#666" />
  </TouchableOpacity>
);

export default function ManageScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const options = [
    {
      title: 'Product Manage',
      icon: 'cube-outline',
      route: '/productmanage',
    },
    {
      title: 'Staff Manage',
      icon: 'people-outline',
      route: '/(manage)/staffmanage',
    },
    {
      title: 'Order Manage',
      icon: 'receipt-outline',
      route: '/(manage)/ordermanage',
    },
  ];

  return (
    <View style={styles.container}>
      <Header title="Quản lý" />
      <ScrollView style={styles.content}>
        {options.map((option, index) => (
          <ManagementOption
            key={index}
            title={option.title}
            icon={option.icon}
            onPress={() => {
              setActiveIndex(index);
              router.push(option.route);
            }}
            active={activeIndex === index}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  activeOption: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeIconContainer: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  activeOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 