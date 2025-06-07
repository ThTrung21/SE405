import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface MainHeaderProps {
  title: string;
}

const MainHeader: React.FC<MainHeaderProps> = ({ title }) => {
  const router = useRouter();

  const onSearchPress = () => {
    console.log('Search pressed');
    // Additional search logic
  };

  const onCartPress = () => {
    router.push('/(stack)/cart');
  };

  return (
    <View style={styles.header}>
      {/* Search Icon */}
      <TouchableOpacity onPress={onSearchPress} activeOpacity={0.7}>
        <Ionicons name="search" size={20} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right icons container */}
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={onCartPress} activeOpacity={0.7}>
          <Ionicons name="cart-outline" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainHeader;

const styles = StyleSheet.create<{
  header: ViewStyle;
  title: TextStyle;
  headerIcons: ViewStyle;
}>({
  header: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
