"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "stores/useAuthStore";
import { useAppStore } from "stores/useAppStore";
import ConversationScreen from "app/chat/conversations";
import { useConversationStore } from "stores/useConversationStore";
import {
  createGenericConversation,
  getCustomerChat,
  getLastMessage,
  getStaffChat,
} from "apis/chat.api";
import ChatScreen from "components/chat";
import { ChatStatus, ChatType } from "constants/status";
import { IConversation } from "interfaces/IConversation";
import { getUserById } from "apis/user.api";
import Toast from "react-native-toast-message";
interface ApiResponse {
  data: IConversation;
  message: string;
}
const defaultAvatar =
  "https://i.pinimg.com/564x/0a/52/d5/0a52d5e52f7b81f96538d6b16ed5dc2b.jpg";
export default function ChatListScreen() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const [currentRole, setCurrentRole] = useState("");
  const loggedIn = useAuthStore((state) => state.loggedIn);
  // const rehydrated = useAuthStore((state) => state.rehydrated);
  const conversations = useConversationStore((state) => state.conversations);
  const openConversation = useConversationStore(
    (state) => state.openConversation
  );
  const setOpenConversaiton = useConversationStore(
    (state) => state.setOpenConversation
  );
  const [selectedConversation, setSelectedConversation] =
    useState<IConversation | null>(null);
  const setConversations = useConversationStore(
    (state) => state.setConversations
  );
  async function fetchConversation(): Promise<IConversation> {
    try {
      const response = await getCustomerChat(profile!.id.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setSelectedConversation(response.data);
      const result: ApiResponse = await response.json();
      return result.data; // Extract the `data` field, typed as IConversation
    } catch (error) {
      console.error("Error fetching conversation:", error);
      throw error;
    }
  }
  const enterchat = (item: IConversation) => {
    setOpenConversaiton(true);
    setSelectedConversation(item);
  };
  useFocusEffect(
    useCallback(() => {
      // if (rehydrated && !loggedIn || !profile) {
      if (!loggedIn || !profile) {
        router.replace("/(auth)/login");
      }
      setCurrentRole(profile!.role.toString());
      console.log(profile);
      console.log(profile!.id.toString());
      const fetchDataCustomer = async () => {
        setIsLoading(true);
        let dataa;
        try {
          dataa = await getCustomerChat(profile!.id.toString());
          setSelectedConversation(dataa.data);
          console.log("data: ", dataa.data);
          // console.log("data: ", conversations[0]);
        } catch {
          Toast.show({
            text1: "Something went wrong. cannot show chat",
            type: "error",
            visibilityTime: 3000,
            onHide: () => router.push("/(dashboard)/homepage"),
          });
        } finally {
          setIsLoading(false);
        }
      };
      const fetchDataStaff = async () => {
        let data;
        if (profile) data = await getStaffChat(profile?.id.toString());
        console.log(data);
        const convos = data.data;

        const enriched = await Promise.all(
          convos.map(async (convo: IConversation) => {
            const senderId = convo.userId; // choose the correct one based on context

            if (!senderId) return { ...convo, sender: null };

            const senderData = await getUserById(senderId.toString());
            const sender = senderData.data;
            const lastMessageData = await getLastMessage(
              convo.id.toString(),
              sender.id.toString()
            );
            console.log(lastMessageData);
            const lastmessage = lastMessageData.data;

            return { ...convo, sender, lastmessage };
          })
        );

        console.log(enriched);
        setConversations(enriched);
      };

      console.log("Role: ", profile!.role.toString());
      if (profile!.role.toString() === "CUSTOMER") fetchDataCustomer();
      else if (
        profile!.role.toString() === "ADMIN" ||
        profile!.role.toString() === "STAFF"
      )
        fetchDataStaff();
      // console.log(conversations);
    }, [profile])
  );
  {
    /* <ChatScreen conversation={conversations[0]} /> */
  }

  const renderChatItem = ({ item }: any) => {
    const avatarUri =
      item.sender?.images && item.sender.images.length > 0
        ? item.sender.images[0]
        : defaultAvatar;
    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => enterchat(item)}>
        <Image source={{ uri: avatarUri }} style={styles.productImage} />

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.productName}>{item.sender?.fullname}</Text>
            {/* <Text style={styles.time}>{item.lastMessage.created}</Text> */}
          </View>
          {/* <Text style={styles.lastMessage} numberOfLines={1}>
					{item.lastMessage}
				</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  const iscustomer = currentRole.toString() === "CUSTOMER" ? true : false;
  const isok = iscustomer && selectedConversation ? true : false;
  return (
    <>
      {isok ? (
        <ChatScreen conversation={selectedConversation!} />
      ) : openConversation && selectedConversation ? (
        <ChatScreen conversation={selectedConversation!} />
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chats</Text>
          </View>
          <FlatList
            data={conversations}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    height: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#003459",
  },
  listContainer: {
    padding: 16,
  },
  chatItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginHorizontal: 40,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003459",
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
});
