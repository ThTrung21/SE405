import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from "react-native";
import Header from "components/header";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "stores/useAuthStore";
import { SubManagementHeader } from "components/managementHeader";
import { useAppStore } from "stores/useAppStore";
import { useStaffStore } from "stores/useStaffStore";
import {
  createNewUser,
  deleteUserById,
  getAllStaff,
  updateUserProfile,
} from "apis/user.api";
import { Role } from "constants/role";
import { IUser } from "interfaces/IUser";
import Toast from "react-native-toast-message";

const defaultAvatar = require("../../../assets/default_avatar.jpg");

// Define Staff type
interface Staff {
  id: string;
  name: string;
  role: "Admin" | "Staff" | "Customer";
  email: string;
  phone: string;
  dob: string;
  avatar: string | null;
}

// const initialStaff: Staff[] = [
//   {
//     id: "1",
//     name: "John Doe",
//     role: "Admin",
//     email: "john@petshop.com",
//     phone: "0123456789",
//     dob: "1990-01-01",
//     avatar: null,
//   },
//   {
//     id: "2",
//     name: "Jane Smith",
//     role: "Staff",
//     email: "jane@petshop.com",
//     phone: "0987654321",
//     dob: "1995-05-10",
//     avatar: null,
//   },
//   {
//     id: "3",
//     name: "Alice Brown",
//     role: "Customer",
//     email: "alice@petshop.com",
//     phone: "0111222333",
//     dob: "2000-12-12",
//     avatar: null,
//   },
//   {
//     id: "4",
//     name: "Bob Lee",
//     role: "Staff",
//     email: "bob@petshop.com",
//     phone: "0999888777",
//     dob: "1992-07-20",
//     avatar: null,
//   },
// ];

const roles: Array<string> = ["ADMIN", "STAFF"];

export default function StaffManage() {
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const staff = useStaffStore((state) => state.staff);
  const setStaff = useStaffStore((state) => state.setStaff);
  const filteredstaff = useStaffStore((state) => state.filteredStaff);
  const setfilteredstaff = useStaffStore((state) => state.setFilteredStaff);

  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const [editStaff, setEditStaff] = useState<IUser | null>(null);
  const [addStaff, setAddStaff] = useState<IUser | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const profile = useAuthStore((state) => state.profile);
  const [staffRole, setStaffRole] = useState("");
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addName, setAddName] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching products...");
        const productData = await getAllStaff();
        setStaff(productData.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
      setStaffRole("STAFF");
    };

    fetchData();
  }, []);

  const openEditModal = (staff: IUser) => {
    setEditStaff(staff);
    setModalVisible(true);
  };
  const HandleAddStaff = async () => {
    setIsLoading(true);
    const payload = {
      email: addEmail,
      password: "12345678",
      fullname: addName,
      phone: addPhone,
      role: staffRole,
    };
    try {
      const response = await createNewUser(payload);
      Toast.show({
        type: "success",
        text1: "Staff created",
        visibilityTime: 1500,
      });
      const da = await getAllStaff();
      setStaff(da.data);

      setAddModalVisible(false);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Something went wrong. Please try again",

        visibilityTime: 1500,
      });
      setAddModalVisible(false);
    }
  };
  const HandleDeleteStaff = async () => {
    if (!editStaff) {
      Toast.show({
        type: "error",
        text1: "Something went wrong. Please try again",
        visibilityTime: 1500,
      });
      return;
    }

    const dId = editStaff.id;

    try {
      await deleteUserById(dId);
      const da = await getAllStaff();
      setStaff(da.data);
      Toast.show({
        type: "success",
        text1: "Staff Deleted",
        visibilityTime: 1500,
      });
      setConfirmationVisible(false);
      setModalVisible(false);
    } catch {
      Toast.show({
        type: "error",
        text1: "Something went wrong. Please try again",
        visibilityTime: 1500,
      });
    }
  };
  const handleupdateprofile = async () => {
    setIsLoading(true);
    let payload = {};
    if (editName !== profile?.fullname) payload = { ...payload, editName };
    if (editPhone !== profile?.phone) payload = { ...payload, editPhone };
    if (editEmail !== profile?.email) payload = { ...payload, editEmail };

    try {
      const { data } = await updateUserProfile(payload);
      const da = await getAllStaff();
      setStaff(da.data);
      setIsLoading(false);
      Toast.show({
        type: "success",
        text1: "Staff updated",
        visibilityTime: 1000,
      });
      setModalVisible(false);
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        visibilityTime: 2000,
      });
      setIsLoading(false);
    }
  };

  // ///////////////////////////////////
  return (
    <View style={styles.container}>
      <SubManagementHeader title="Staff Management" />
      <View style={styles.content}>
        <FlatList
          data={staff}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.staffCard}
              onPress={() => openEditModal(item)}
            >
              <View style={styles.staffInfo}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={item.avatar ? { uri: item.avatar } : defaultAvatar}
                    style={styles.avatar}
                  />
                </View>
                <View style={styles.staffDetails}>
                  <Text style={styles.staffName}>{item.fullname}</Text>
                  <Text style={styles.staffRole}>{item.role}</Text>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Ionicons name="create-outline" size={20} color="#003459" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Modal Edit Staff */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Staff</Text>
            <TouchableOpacity style={styles.avatarWrapper}>
              <Image
                source={
                  editStaff && editStaff.avatar
                    ? { uri: editStaff.avatar }
                    : defaultAvatar
                }
                style={styles.avatarBig}
              />
              <View style={styles.avatarEditIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={editStaff?.fullname ? editStaff?.fullname : editName}
              onChangeText={setEditName}
            />
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={editStaff?.email ? editStaff?.email : editEmail}
              onChangeText={setEditEmail}
              keyboardType="email-address"
            />
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              value={editStaff?.phone ? editStaff?.phone : editPhone}
              onChangeText={setEditPhone}
              keyboardType="phone-pad"
            />

            <View style={styles.dropdownWrap}>
              <Text style={styles.dropdownLabel}>Role</Text>
              <View style={styles.dropdownBox}>
                {roles.map((role, index) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleOption,
                      editStaff?.role === role && styles.roleOptionActive, // Highlight the selected option
                      {
                        backgroundColor:
                          editStaff?.role === role ? "#FAD69C" : "transparent",
                      }, // Set the color FAD69C for the selected option
                    ]}
                    onPress={() => {
                      // If there's no selected role, set it to the first role
                      if (!editStaff?.role) {
                        const roleValue = index === 0 ? "1" : "2"; // Set role as '1' or '2'
                        setEditStaff((s) =>
                          s ? { ...s, role: roleValue } : s
                        );
                      }
                    }}
                    disabled={!!editStaff?.role} // Disable if a role is already set
                  >
                    <Text
                      style={[
                        styles.roleOptionText,
                        editStaff?.role === role && styles.roleOptionTextActive,
                      ]}
                    >
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.modalButtons}>
              {!isAddMode && (
                <TouchableOpacity
                  onPress={() => setConfirmationVisible(true)}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleupdateprofile}
                style={[
                  styles.saveBtn,
                  editStaff?.id !== profile?.id &&
                    editStaff?.role === "ADMIN" &&
                    styles.saveBtnDisabled, // Apply disabled style if condition is met
                ]}
                disabled={
                  editStaff?.id !== profile?.id && editStaff?.role === "ADMIN"
                } // Disable if condition is true
              >
                <Text
                  style={[
                    styles.saveBtnText,
                    editStaff?.id !== profile?.id &&
                      editStaff?.role === "ADMIN" &&
                      styles.saveBtnTextDisabled, // Apply disabled text style
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* confirmation modal */}
      <Modal visible={confirmationVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Are you sure?</Text>
            <TouchableOpacity
              onPress={() => setConfirmationVisible(false)}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={HandleDeleteStaff}
              style={styles.saveBtn}
            >
              <Text style={styles.saveBtnText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* add staff modal */}
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add New Staff</Text>
            <TouchableOpacity style={styles.avatarWrapper}>
              <Image source={defaultAvatar} style={styles.avatarBig} />
            </TouchableOpacity>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={addName}
              onChangeText={setAddName}
            />
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={addEmail}
              onChangeText={setAddEmail}
              keyboardType="email-address"
            />
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              value={addPhone}
              onChangeText={setAddPhone}
              keyboardType="phone-pad"
            />
            <View style={styles.dropdownWrap}>
              <Text style={styles.dropdownLabel}>Role</Text>
              <View style={styles.dropdownBox}>
                {roles.map((role, index) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleOption,
                      staffRole === role && styles.roleOptionActive, // Keep the active style for selected role
                      {
                        backgroundColor:
                          staffRole === role ? "#FAD69C" : "transparent",
                      }, // Apply color FAD69C for selected role
                    ]}
                    onPress={() => {
                      const roleValue = index === 0 ? "ADMIN" : "STAFF"; // Set role to '1' or '2' based on index
                      setStaffRole(roleValue);
                    }}
                  >
                    <Text
                      style={[
                        styles.roleOptionText,
                        addStaff?.role === role && styles.roleOptionTextActive,
                      ]}
                    >
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setAddModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={HandleAddStaff} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Add</Text>
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
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  staffCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  staffInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 52, 89, 0.1)",
    justifyContent: "center",
    alignItems: "center",
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
    fontWeight: "600",
    color: "#333",
  },
  staffRole: {
    fontSize: 15,
    color: "#888",
    marginTop: 2,
  },
  saveBtnTextDisabled: {
    color: "#888", // Disabled text color
  },
  saveBtnDisabled: {
    backgroundColor: "#BDBDBD", // Disabled button color
  },
  editButton: {
    padding: 8,
  },
  addButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FAD69C",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: 340,
    maxWidth: "90%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#003459",
    marginBottom: 16,
    textAlign: "center",
  },
  avatarWrapper: {
    alignSelf: "center",
    marginVertical: 12,
  },
  avatarBig: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FAD69C",
    backgroundColor: "#fff",
  },
  avatarEditIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FAD69C",
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    marginBottom: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    width: 260,
    alignSelf: "center",
  },
  dropdownWrap: {
    width: 260,
    marginBottom: 12,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#003459",
    marginBottom: 6,
  },
  dropdownBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 6,
  },
  roleOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 2,
    backgroundColor: "#fff",
  },
  roleOptionActive: {
    backgroundColor: "#FAD69C",
  },
  roleOptionText: {
    fontSize: 16,
    color: "#003459",
    fontWeight: "bold",
  },
  roleOptionTextActive: {
    color: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 8,
  },
  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#ff4444",
    marginRight: "auto",
  },
  deleteBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#003459",
  },
  cancelBtnText: {
    color: "#003459",
    fontWeight: "bold",
    fontSize: 16,
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#FAD69C",
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#003459",
    marginBottom: 4,
    alignSelf: "flex-start",
    marginLeft: 8,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
});
