"use client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ListRenderItemInfo,
  TextInput,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import AppButton from "../../components/appButton";
import { useAuthStore } from "stores/useAuthStore";
import { useAppStore } from "stores/useAppStore";
import { useProductStore } from "stores/useProductStore";
import { getAllProducts } from "apis/product.api";
import { IProduct } from "interfaces/IProduct";
import { IUser } from "interfaces/IUser";
import { getUserById } from "apis/user.api";

const FavoritesScreen: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  //////////////////////////////////////////////////////////////
  const profile = useAuthStore((state) => state.profile);
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  // const setFilteredProducts = useProductStore(
  // 	(state) => state.setFilteredProducts
  // );
  const setProducts = useProductStore((state) => state.setProducts);
  const currentUser = useState<IUser>();
  const products = useProductStore((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const loggedIn = useAuthStore((state) => state.loggedIn);
  //-========================================
  useEffect(() => {
    console.log(loggedIn);
    console.log(profile!.likedproduct);

    if (!loggedIn || profile == null) {
      router.replace("/(auth)/login");
    }
    let currentUser:IUser;
     const fetchData = async () => {
    //   setIsLoading(true);
      try {
        const user = await getUserById(profile!.id.toString())
        currentUser = (user.data)
    //     console.log("Fetching products...");
    //     const productData = await getAllProducts();
    //     console.log("check");
    //     if (productData.status)
    //       setProducts(productData.data);
    //     console.log("Products: \n", products);
    //   } catch (error) {
    //     console.error("Fetch error:", error);
      }
      catch{
        currentUser = profile!;
      }

      fetchData();
    }
    console.log("Profile: ", profile!.likedproduct);

    if (products.length > 0 && profile!.likedproduct) {
      
      const likedProductIds = profile!.likedproduct;
      console.log("Liked product IDs:", likedProductIds);

      // Filter products based on likedProductIds
      const filtered = products.filter((product) =>
        likedProductIds.includes(product.id.toString())
      );
      setFilteredProducts(filtered);
      console.log("Filtered products (liked by user):", filtered);
    } else if (products.length > 0 && (!profile || !profile.likedproduct)) {
      // Handle cases where there's no user profile or likedproduct array is missing/empty
      console.log(
        "No user profile or liked products found, displaying an empty list."
      );
      setFilteredProducts([]);
      setIsLoading(false);
    }
  }, []);

  const renderItem = ({ item }: ListRenderItemInfo<IProduct>) => (
    <View style={styles.cartItem}>
      <TouchableOpacity
        onPress={() =>
          router.push({ pathname: "/(stack)/item", params: { id: item.id } })
        }
      >
        <Image source={{ uri: item.images[0] }} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search and Cart */}
      <View style={styles.header}>
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>Favorites</Text>
        </View>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => router.push("/(stack)/cart")}
        >
          <Ionicons name="cart-outline" size={28} color="#003459" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text>No favorites found.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 24,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerIcon: {
    padding: 8,
  },
  headerTitleWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003459",
  },
  headerSearchInput: {
    fontSize: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: "100%",
    color: "#003459",
  },
  content: { padding: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    elevation: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
    marginLeft: 16,
  },
  info: {
    flex: 1,
    marginHorizontal: 12,
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    color: "#333",
    fontSize: 13,
  },
  actions: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    padding: 6,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
});
