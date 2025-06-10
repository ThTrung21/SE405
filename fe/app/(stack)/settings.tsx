"use client";
import React, { JSX, useEffect, useState } from "react";
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
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Header from "../../components/header";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "stores/useAuthStore";
import { useRouter } from "expo-router";
import { useAppStore } from "stores/useAppStore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "utils/firebase";
import { updateUserProfile } from "apis/user.api";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";

const defaultAvatar = require("../../assets/avatar-default.png");
const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};
const SettingsScreen = (): JSX.Element => {
  // const [notifications, setNotifications] = useState({
  //   sales: true,
  //   arrivals: false,
  //   delivery: false,
  // });
  const [avatarUriToUpload, setAvatarUriToUpload] = useState<string | null>(
    null
  ); // for upload on save
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);
  const loggedIn = useAuthStore((state) => state.loggedIn);
  // const rehydrated = useAuthStore((state) => state.rehydrated);
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  const setProfile = useAuthStore((state) => state.setProfile);

  // edit info
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
      }
    })();
    // if (!rehydrated) {
    //   // Auth state is still being rehydrated
    //   return;
    // }
    console.log(profile?.avatar);
    if (!loggedIn) {
      router.push("/(auth)/login");
    }
    if (profile) {
      setEditAddress(profile.address || "");
      setEditPhone(profile.phone || "");
      setEditName(profile.fullname || "");
      setEditEmail(profile.email || "");
    }
  }, [loggedIn]);
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
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <Header title="Settings" />
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
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
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardItem}
              onPress={() => {}}
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

          {/* noti */}
          {/* <View style={styles.section}>
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
          </View> */}
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
    </SafeAreaView>
  );
};

export default SettingsScreen;

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
    fontSize: 22,
    fontWeight: "bold",
    color: "#003459",
    marginBottom: 16,
    textAlign: "center",
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
});
