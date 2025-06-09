import { useRouter } from "expo-router";
import { IConversation } from "interfaces/IConversation";
import { TouchableOpacity, StyleSheet, View, FlatList } from "react-native";
interface ConversationScreenProps {
  conversations: IConversation[];
}

const ConversationScreen: React.FC<ConversationScreenProps> = ({
  conversations,
}) => {
  const router = useRouter();
  const renderChatItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        router.push({ pathname: "/chat", params: { id: item.id } })
      }
    >
      {/* <Image source={item.productImage} style={styles.productImage} /> */}
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <div></div>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <FlatList
        data={conversations}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};
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

export default ConversationScreen;
