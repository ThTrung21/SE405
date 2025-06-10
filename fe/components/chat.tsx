import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { IConversation } from "interfaces/IConversation";
import { IMessage } from "interfaces/IMessage";
import { getMessages, sendMessage } from "apis/chat.api";
import { IProduct } from "interfaces/IProduct";
import { getProductById } from "apis/product.api";
import { useAuthStore } from "stores/useAuthStore";
import Toast from "react-native-toast-message";
import { getUserById } from "apis/user.api";
import { initSocket } from "utils/socket";
import { getAccessToken } from "utils/auth";
import { Socket } from "socket.io-client";
import { ChatHeader } from "./subheader";

interface ChatScreenProps {
  conversation: IConversation;
  productId?: string | number;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ conversation, productId }) => {
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [senderNames, setSenderNames] = useState<Record<number, string>>({});
  const [socketReady, setSocketReady] = useState(false);
  const profile = useAuthStore((state) => state.profile);
  // const rehydrated = useAuthStore((state) => state.rehydrated);
  const socketRef = useRef<Socket | null>(null);
  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const loadMessages = async () => {
    // if (!conversation || !rehydrated) return;
    if (!conversation) return;
    try {
      const token = getAccessToken();
      const response = await getMessages(conversation!.id.toString());
      const msgs = response.data;
      setMessages(msgs);

      const senderIds = [...new Set(msgs.map((msg: IMessage) => msg.senderId))];
      const results = await Promise.all(
        senderIds.map((id) =>
          getUserById(Number(id).toString()).then((res) => ({
            id,
            name: res.data.fullname,
          }))
        )
      );
      const nameMap: Record<number, string> = {};
      results.forEach(({ id, name }) => {
        nameMap[Number(id)] = name;
      });
      setSenderNames(nameMap);

      scrollToEnd();
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || sending || !profile || !conversation?.id) return;

    const token = getAccessToken();
    const newMessage: Partial<IMessage> = {
      content: input,
      senderId: profile.id,
      conversationId: Number(conversation!.id),
    };

    try {
      setSending(true);
      console.log(conversation);
      console.log(Number(conversation!.id));
      const res = await sendMessage({ ...newMessage, productId: productId });
      const savedMessage = res.data.data;
      // Emit via socket instead of (or in addition to) HTTP
      socketRef.current?.emit("sendMessage", savedMessage);

      loadMessages();
      setInput("");
    } catch (error) {
      console.error("Send failed:", error);
    } finally {
      setSending(false);
    }
  };

  const sendProductAttachment = useCallback(async () => {
    if (!productId || !conversation?.id) return;

    try {
      const token = getAccessToken();
      const product: IProduct = await getProductById(productId);
      const message: Partial<IMessage> = {
        content: "I want to ask about this product",
        productId: product.id,
        conversationId: conversation.id,
      };
      await sendMessage(message);
      await loadMessages();
    } catch (error) {
      console.error("Failed to send product attachment:", error);
    }
  }, [productId, conversation?.id]);
  //init
  useFocusEffect(
    useCallback(() => {
      if (!conversation?.id) return;

      const socket = initSocket();
      socketRef.current = socket;
      const conversationRoom = `conversation-${conversation.id}`;

      socket!.on("connect", () => {
        socket!.emit("joinConversation", conversation.id); // join the correct room
        console.log("Joined room:", conversationRoom);
        setSocketReady(true);
      });

      socket!.on("newMessage", (newMsg: IMessage) => {
        console.log("New message received via socket:", newMsg);
        setMessages((prev) => [...prev, newMsg]);
      });

      return () => {
        socket!.off("newMessage");
        socket!.disconnect();
      };
    }, [conversation?.id])
  );

  useEffect(() => {
    // if (conversation?.id && rehydrated) {
    if (conversation!.id) {
      loadMessages();
    } else console.log("WTF");
  }, []);

  useEffect(() => {
    if (productId) sendProductAttachment();
  }, [productId]);

  const renderMessage = ({ item }: { item: IMessage }) => {
    const isMe = item.senderId === profile?.id;
    const isProduct = !!item.productId;
    const displayName = isMe
      ? "You"
      : senderNames[Number(item.senderId)] || "Support";

    return (
      <View style={{ alignItems: isMe ? "flex-end" : "flex-start" }}>
        <Text
          style={[
            styles.senderName,
            { alignSelf: isMe ? "flex-end" : "flex-start" },
          ]}
        >
          {displayName}
        </Text>
        <View
          style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}
        >
          {isProduct ? (
            <ProductCard productId={item.productId} />
          ) : (
            <Text style={styles.bubbleText}>{item.content}</Text>
          )}
        </View>
      </View>
    );
  };

  const ProductCard = ({ productId }: { productId?: string | number }) => {
    const [product, setProduct] = useState<IProduct | null>(null);

    useEffect(() => {
      const token = getAccessToken();
      if (productId) {
        getProductById(productId).then(setProduct).catch(console.error);
      }
    }, [productId]);

    if (!product) return null;

    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.productCard}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.productImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f9f9f9" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ChatHeader title="Chat" />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={scrollToEnd}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={handleSend} style={styles.iconBtn}>
          <Ionicons name="send" size={28} color="#FFA500" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    position: "absolute",
    left: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#003459",
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  bubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  bubbleMe: {
    backgroundColor: "#FFA50022",
    alignSelf: "flex-end",
    borderTopRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  bubbleText: {
    fontSize: 16,
    color: "#222",
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 10,
    marginBottom: 10,
    maxWidth: "80%",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#f5f5f5",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#003459",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    color: "#FFA500",
    fontWeight: "bold",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    color: "#222",
  },
  iconBtn: {
    padding: 4,
  },
  senderName: {
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
    marginHorizontal: 8,
  },
});
export default ChatScreen;
