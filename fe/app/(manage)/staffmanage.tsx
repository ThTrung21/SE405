import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image, Modal, TextInput, Alert } from 'react-native';
import Header from '../../components/header';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const defaultAvatar = require('../../assets/avatar-default.png');

// Define Staff type
interface Staff {
  id: string;
  name: string;
  role: 'Admin' | 'Staff' | 'Customer';
  email: string;
  phone: string;
  dob: string;
  avatar: string | null;
}

const initialStaff: Staff[] = [
  { id: '1', name: 'John Doe', role: 'Admin', email: 'john@petshop.com', phone: '0123456789', dob: '1990-01-01', avatar: null },
  { id: '2', name: 'Jane Smith', role: 'Staff', email: 'jane@petshop.com', phone: '0987654321', dob: '1995-05-10', avatar: null },
  { id: '3', name: 'Alice Brown', role: 'Customer', email: 'alice@petshop.com', phone: '0111222333', dob: '2000-12-12', avatar: null },
  { id: '4', name: 'Bob Lee', role: 'Staff', email: 'bob@petshop.com', phone: '0999888777', dob: '1992-07-20', avatar: null },
];

const roles: Array<Staff['role']> = ['Admin', 'Staff'];

export default function StaffManage() {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [modalVisible, setModalVisible] = useState(false);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const openEdit = (item: Staff) => {
    setEditStaff({ ...item });
    setIsAddMode(false);
    setModalVisible(true);
  };

  const openAdd = () => {
    setEditStaff({
      id: Date.now().toString(),
      name: '',
      role: 'Staff',
      email: '',
      phone: '',
      dob: '',
      avatar: null
    });
    setIsAddMode(true);
    setModalVisible(true);
  };

  const handleDelete = () => {
    if (!editStaff) return;
    Alert.alert(
      'Delete Staff',
      'Are you sure you want to delete this staff member?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
            setStaff(prev => prev.filter(s => s.id !== editStaff.id));
            setModalVisible(false);
          }
        },
      ]
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const parseDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setEditStaff((prev) => prev ? { ...prev, avatar: result.assets[0].uri } : prev);
    }
  };

  const handleSave = () => {
    if (!editStaff) return;
    if (isAddMode) {
      setStaff(prev => [...prev, editStaff]);
    } else {
      setStaff(prev => prev.map(s => s.id === editStaff.id ? editStaff : s));
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header title="Staff Management" />
      <View style={styles.content}>
        <ScrollView>
          {staff.map((item) => (
            <TouchableOpacity key={item.id} style={styles.staffCard} onPress={() => openEdit(item)}>
              <View style={styles.staffInfo}>
                <View style={styles.avatarContainer}>
                  <Image source={item.avatar ? { uri: item.avatar } : defaultAvatar} style={styles.avatar} />
                </View>
                <View style={styles.staffDetails}>
                  <Text style={styles.staffName}>{item.name}</Text>
                  <Text style={styles.staffRole}>{item.role}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={() => openEdit(item)}>
                <Ionicons name="create-outline" size={20} color="#003459" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={openAdd}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Modal Edit/Add Staff */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{isAddMode ? 'Add New Staff' : 'Edit Staff'}</Text>
            <TouchableOpacity style={styles.avatarWrapper} onPress={pickAvatar}>
              <Image source={editStaff && editStaff.avatar ? { uri: editStaff.avatar } : defaultAvatar} style={styles.avatarBig} />
              <View style={styles.avatarEditIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={editStaff?.name || ''}
              onChangeText={v => setEditStaff(s => s ? { ...s, name: v } : s)}
            />
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editStaff?.email || ''}
              onChangeText={v => setEditStaff(s => s ? { ...s, email: v } : s)}
              keyboardType="email-address"
            />
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={editStaff?.phone || ''}
              onChangeText={v => setEditStaff(s => s ? { ...s, phone: v } : s)}
              keyboardType="phone-pad"
            />
            <Text style={styles.inputLabel}>Date Of Birth</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              value={editStaff ? formatDate(editStaff.dob) : ''}
              onChangeText={v => setEditStaff(s => s ? { ...s, dob: parseDate(v) } : s)}
            />
            <View style={styles.dropdownWrap}>
              <Text style={styles.dropdownLabel}>Role</Text>
              <View style={styles.dropdownBox}>
                {roles.map(role => (
                  <TouchableOpacity
                    key={role}
                    style={[styles.roleOption, editStaff?.role === role && styles.roleOptionActive]}
                    onPress={() => setEditStaff(s => s ? { ...s, role } : s)}
                  >
                    <Text style={[styles.roleOptionText, editStaff?.role === role && styles.roleOptionTextActive]}>{role}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.modalButtons}>
              {!isAddMode && (
                <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>{isAddMode ? 'Add' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  staffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  staffInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 52, 89, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  staffDetails: {
    flex: 1,
  },
  staffName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  staffRole: {
    fontSize: 15,
    color: '#888',
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FAD69C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
  avatarWrapper: {
    alignSelf: 'center',
    marginVertical: 12,
  },
  avatarBig: {
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    width: 260,
    alignSelf: 'center',
  },
  dropdownWrap: {
    width: 260,
    marginBottom: 12,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003459',
    marginBottom: 6,
  },
  dropdownBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 6,
  },
  roleOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 2,
    backgroundColor: '#fff',
  },
  roleOptionActive: {
    backgroundColor: '#FAD69C',
  },
  roleOptionText: {
    fontSize: 16,
    color: '#003459',
    fontWeight: 'bold',
  },
  roleOptionTextActive: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#ff4444',
    marginRight: 'auto',
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#003459',
  },
  cancelBtnText: {
    color: '#003459',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#FAD69C',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003459',
    marginBottom: 4,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
}); 