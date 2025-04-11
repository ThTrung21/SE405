import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ProfileHeaderProps {
  title: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title }) => {
  const router = useRouter();
  const onSearchPress = () => {
    // Handle onSearchPress
  };

  const onLogoutPress = () => {
    // Handle onLogoutPress
    router.replace('login')
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
        <TouchableOpacity onPress={onLogoutPress} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileHeader;

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
