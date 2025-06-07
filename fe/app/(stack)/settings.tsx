import React, { JSX, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/header';

type NotificationKey = 'sales' | 'arrivals' | 'delivery';

const SettingsScreen = (): JSX.Element => {
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    sales: true,
    arrivals: false,
    delivery: false,
  });

  const toggleSwitch = (key: NotificationKey) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <Header title="Settings" />
        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <Ionicons name="pencil-outline" size={18} />
            </View>

            <TextInput style={styles.input} value="Bruno Pham" editable={false} />
            <TextInput style={styles.input} value="bruno203@gmail.com" editable={false} />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Password</Text>
              <Ionicons name="pencil-outline" size={18} />
            </View>
            <TextInput style={styles.input} value="*************" editable={false} secureTextEntry />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Sales</Text>
              <Switch value={notifications.sales} onValueChange={() => toggleSwitch('sales')} />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>New arrivals</Text>
              <Switch value={notifications.arrivals} onValueChange={() => toggleSwitch('arrivals')} />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Delivery status changes</Text>
              <Switch value={notifications.delivery} onValueChange={() => toggleSwitch('delivery')} />
            </View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.faq}>
              <Text style={styles.switchLabel}>FAQ</Text>
              <Ionicons name="chevron-forward" size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    paddingVertical: 24
   },
  content: { padding: 16 },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
  },
  faq: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    alignItems: 'center',
  },
});
