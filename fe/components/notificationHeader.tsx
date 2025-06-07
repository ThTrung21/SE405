import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationHeaderProps {
  title: string;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({ title }) => {
  const onSearchPress = () => {
    // Handle onSearchPress
  };

  return (
    <View style={styles.header}>
      {/* Search Icon */}
      <TouchableOpacity onPress={onSearchPress} activeOpacity={0.7}>
        <Ionicons name="search" size={20} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right icons container (empty for now) */}
      <View style={styles.headerIcons} />
    </View>
  );
};

export default NotificationHeader;

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
