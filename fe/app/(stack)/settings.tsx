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
  Image,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/header';
import * as ImagePicker from 'expo-image-picker';

const defaultAvatar = require('../../assets/avatar-default.png');

const SettingsScreen = (): JSX.Element => {
  const [notifications, setNotifications] = useState({
    sales: true,
    arrivals: false,
    delivery: false,
  });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Bruno Pham',
    email: 'bruno203@gmail.com',
    phone: '',
    dob: '',
  });

  const toggleSwitch = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <Header title="Settings" />
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity style={styles.avatarWrapper} onPress={() => setEditModal(true)}>
              <Image
                source={avatar ? { uri: avatar } : defaultAvatar}
                style={styles.avatar}
              />
              <View style={styles.avatarEditIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarName}>{personalInfo.fullName}</Text>
            <Text style={styles.avatarEmail}>{personalInfo.email}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Password</Text>
              <Ionicons name="pencil-outline" size={20} />
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
              <Ionicons name="chevron-forward" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Modal for editing personal info and avatar */}
      <Modal visible={editModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Personal Information</Text>
            <TouchableOpacity style={styles.avatarWrapper} onPress={pickAvatar}>
              <Image
                source={avatar ? { uri: avatar } : defaultAvatar}
                style={styles.avatar}
              />
              <View style={styles.avatarEditIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={personalInfo.fullName}
              onChangeText={v => setPersonalInfo(info => ({ ...info, fullName: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={personalInfo.email}
              onChangeText={v => setPersonalInfo(info => ({ ...info, email: v }))}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={personalInfo.phone}
              onChangeText={v => setPersonalInfo(info => ({ ...info, phone: v }))}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Date Of Birth (YYYY-MM-DD)"
              value={personalInfo.dob}
              onChangeText={v => setPersonalInfo(info => ({ ...info, dob: v }))}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
              <TouchableOpacity onPress={() => setEditModal(false)} style={styles.cancelBtn}>
                <Text style={{ color: '#003459', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditModal(false)} style={styles.saveBtn}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#003459',
  },
  section: {
    marginBottom: 32,
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#003459',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    width: '100%',
  },
  avatarWrapper: {
    alignSelf: 'center',
    marginVertical: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FAD69C',
    backgroundColor: '#fff',
  },
  avatarEditIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FAD69C',
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003459',
    textAlign: 'center',
    marginTop: 8,
  },
  avatarEmail: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    width: 300,
    alignSelf: 'center',
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
    width: 300,
    alignSelf: 'center',
  },
  switchLabel: {
    fontSize: 18,
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
    width: 300,
    alignSelf: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 340,
    maxWidth: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003459',
    marginBottom: 16,
    textAlign: 'center',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#003459',
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#003459',
    marginLeft: 8,
  },
});
