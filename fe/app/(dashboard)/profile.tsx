"use client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import ProfileHeader from "../../components/profileHeader";
import { useRouter } from "expo-router";
import { useAuthStore } from "stores/useAuthStore";
import Header from "components/header";
import { useAppStore } from "stores/useAppStore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "utils/firebase";
import { changeUserPassword, updateUserProfile } from "apis/user.api";
import Toast from "react-native-toast-message";
import { executeMutation } from "firebase/data-connect";
import { Role } from "constants/role";
const defaultAvatar = require("../../assets/avatar-default.png");
const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};
export default function ProfileScreen() {
  const [avatarUriToUpload, setAvatarUriToUpload] = useState<string | null>(
    null
  ); // for upload on save
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const rehydrated = useAuthStore((state) => state.rehydrated);
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const [role, setRole] = useState("");
  const setProfile = useAuthStore((state) => state.setProfile);

  // edit info
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
      }
    })();
    if (rehydrated && (!loggedIn || !profile)) {
      router.replace("/(auth)/login");
    }

    // Optionally also guard for auth
    if (!loggedIn) {
      router.push("/(auth)/login");
      return;
    }
    console.log("Profile role: ", profile);
    if (profile) {
      setEditAddress(profile?.address || "");
      setEditPhone(profile?.phone || "");
      setEditName(profile?.fullname || "");
      setEditEmail(profile?.email || "");
      setRole(profile?.role);

      setCurrentPassword(profile?.password || "");
    }
  }, [rehydrated, loggedIn, profile]);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setAvatar(uri); // show preview
      setAvatarUriToUpload(uri); // store for later upload
    }
  };
  const handleChangePassword = async () => {
    setIsLoading(true);
    if (newPassword.length < 8) {
      Toast.show({
        type: "error",
        text1: "New password is <8 characters",
        visibilityTime: 2000,
      });
      setIsLoading(false);
      setPasswordModal(false);
      return;
    }
    if (currentPassword !== currentPasswordInput) {
      Toast.show({
        type: "error",
        text1: "Wrong Password",
        visibilityTime: 2000,
      });
      setIsLoading(false);
      setPasswordModal(false);
      return;
    }
    if (confirmPassword !== newPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords mismatch",
        visibilityTime: 2000,
      });
      setIsLoading(false);
      setPasswordModal(false);
      return;
    }
    try {
      await changeUserPassword({ currentPassword, newPassword });
      setIsLoading(false);
      Toast.show({
        type: "success",
        text1: "Password Changed",
        visibilityTime: 2000,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        visibilityTime: 2000,
      });
    }
  };

  const handleupdateprofile = async () => {
    setIsLoading(true);
    let payload = {};
    if (editName !== profile?.fullname) payload = { ...payload, editName };
    if (editAddress !== profile?.address) payload = { ...payload, editAddress };
    if (editPhone !== profile?.phone) payload = { ...payload, editPhone };
    if (editEmail !== profile?.email) payload = { ...payload, editEmail };
    if (avatarUriToUpload) {
      const blob = await uriToBlob(avatarUriToUpload);
      const filename = avatarUriToUpload.split("/").pop(); // you can make this more unique if needed
      const storage = getStorage(app);
      const storageRef = ref(storage, `petshop/avatars/${filename}`);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      payload = { ...payload, avatar: downloadURL }; // add to final payload
    }
    try {
      const { data } = await updateUserProfile(payload);
      setProfile(data);
      setIsLoading(false);
      Toast.show({
        type: "success",
        text1: "Profile updated",
        visibilityTime: 1000,
      });
      setEditModal(false);
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
  const isStaff =
    loggedIn && (profile?.role === "ADMIN" || profile?.role === "STAFF");
  const onOrdersPress = () => {
    router.push("/orders");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <ProfileHeader title="Settings" />
        <View style={styles.content}>
          <View style={styles.section}>
            {/* <Text style={styles.sectionTitle}>Personal Information</Text> */}
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={() => setEditModal(true)}
            >
              <Image
                source={
                  profile?.avatar ? { uri: profile?.avatar } : defaultAvatar
                }
                style={styles.avatar}
              />
              <View style={styles.avatarEditIcon}>
                <MaterialIcons name="edit" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarName}>{profile?.fullname}</Text>
            <Text style={styles.avatarEmail}>{profile?.email}</Text>
          </View>
          {isStaff ? (
            <View style={styles.manageCard}>
              <TouchableOpacity
                style={styles.cardItem}
                onPress={() => router.push("/(manage)/manage")}
                activeOpacity={0.7}
              >
                <Text style={styles.cardTitle}>Manage</Text>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#ccc"
                  style={styles.chevron}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardItem}
              onPress={onOrdersPress}
              activeOpacity={0.7}
            >
              <Text style={styles.cardTitle}>My orders</Text>
              <Text style={styles.cardSubtitle}>Already have 10 orders</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#ccc"
                style={styles.chevron}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cardItem}
              onPress={() => setPasswordModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.cardTitle}>Change Password</Text>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#ccc"
                style={styles.chevron}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cardItem}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <Text style={styles.cardTitle}>FAQ</Text>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#ccc"
                style={styles.chevron}
              />
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
                source={
                  profile?.avatar ? { uri: profile?.avatar } : defaultAvatar
                }
                style={styles.avatar}
              />
              <View style={styles.avatarEditIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={editEmail}
              onChangeText={setEditEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              value={editPhone}
              onChangeText={setEditPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor="#999"
              value={editAddress}
              onChangeText={setEditAddress}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => setEditModal(false)}
                style={styles.cancelBtn}
              >
                <Text
                  style={{ color: "#003459", fontWeight: "bold", fontSize: 16 }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleupdateprofile}
                style={styles.saveBtn}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={passwordModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.modalTitle2}>Change Password</Text>
              <TouchableOpacity
                style={styles.closeIconBtn}
                onPress={() => setPasswordModal(false)}
              >
                <Text
                  style={{ fontSize: 28, color: "#888", fontWeight: "bold" }}
                >
                  ×
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Current password"
              value={currentPasswordInput}
              onChangeText={setCurrentPasswordInput}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Confirm new Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleChangePassword}
            >
              <Text style={styles.modalButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 24,
  },
  content: { padding: 16 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#003459",
  },
  section: {
    marginBottom: 32,
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
    width: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    color: "#003459",
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    width: "100%",
  },
  avatarWrapper: {
    alignSelf: "center",
    marginVertical: 12,
  },
  avatar: {
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
  avatarName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003459",
    textAlign: "center",
    marginTop: 8,
  },
  avatarEmail: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    marginBottom: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    width: 300,
    alignSelf: "center",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    alignItems: "center",
    width: 300,
    alignSelf: "center",
  },
  switchLabel: {
    fontSize: 18,
  },
  faq: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    alignItems: "center",
    width: 300,
    alignSelf: "center",
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#003459",
    marginBottom: 16,
    textAlign: "center",
  },
  modalTitle2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#003459",
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#003459",
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  manageCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    marginBottom: 12,
  },
  cardItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    position: "relative",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#888",
  },
  chevron: {
    position: "absolute",
    right: 15,
    top: "40%",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: "#003459",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeIconBtn: {
    padding: 8,
  },
});
