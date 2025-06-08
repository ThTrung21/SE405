"use client";

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, Link, usePathname } from "expo-router";

import FavoriteButton from "../../components/favoriteButton";
import Header from "../../components/header";
import AppButton from "../../components/appButton";
import { useAppStore } from "stores/useAppStore";
import { useProductStore } from "stores/useProductStore";
import { getProductById } from "apis/product.api";
import { useAuthStore } from "stores/useAuthStore";
import { useCartStore } from "stores/useCartStore";
import Toast from "react-native-toast-message";
import MainHeader from "components/mainHeader";
import SubHeader from "components/subheader";
import { Bold } from "lucide-react-native";

export default function Item() {
  const { id } = useLocalSearchParams(); // get id from route params
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const setProduct = useProductStore((state) => state.setProduct);
  const product = useProductStore((state) => state.product);
  const pathname = usePathname();
  // const params: any = params();
  const [quantity, setQuantity] = useState(1);
  const [previewImage, setPreviewImage] = useState<string>();
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const handleFavoriteChange = (fav: any) => {
    //
  };
  const addToCart = useCartStore((state) => state.addToCart);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching products...id = ", id);
        const productData = await getProductById(Number(id));

        setProduct(productData.data);
        setPreviewImage(productData.data.images[0]);
        console.log(productData.data.images[0]);
        // setQuantity(0);
        if (productData.data.stock === 0) {
          setQuantity(0);
        } else {
          setQuantity(1);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Pet not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <SubHeader title="Pet Details" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Pet Image */}
        <View style={{ width: "100%", alignItems: "center", marginBottom: 20 }}>
          <View style={styles.previewContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#ccc" />
            ) : (
              <Image
                source={{ uri: previewImage }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            )}
          </View>

          {/* Thumbnail row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 16 }}
          >
            {product?.images?.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setPreviewImage(image)}
                activeOpacity={0.8}
                style={[
                  styles.thumbnailWrapper,
                  previewImage === image && styles.activeThumbnail,
                ]}
              >
                <Image source={{ uri: image }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Info */}
        <View style={styles.info}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.title}>Stock: {product.stock} left</Text>
          {/* Description */}
          <span style={styles.desc}>Description:</span>
          <Text style={styles.description}>{product.desc}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <MaterialCommunityIcons
              name="bookmark-check"
              size={20}
              color="#facc15"
            />
            <Text style={styles.ratingText}>{product.score} </Text>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantityRow}>
            <TouchableOpacity
              disabled={product.stock === 0 || quantity <= 1}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Ionicons
                name="remove-outline"
                size={24}
                color={product.stock === 0 || quantity <= 1 ? "#ccc" : "black"}
              />
            </TouchableOpacity>

            <Text style={styles.quantityText}>
              {quantity.toString().padStart(2, "0")}
            </Text>

            <TouchableOpacity
              disabled={product.stock == 0 || quantity >= product.stock}
              onPress={() => {
                if (product.stock > 0 && quantity < product.stock) {
                  setQuantity(quantity + 1);
                }
              }}
            >
              <Ionicons
                name="add-outline"
                size={24}
                color={
                  product.stock === 0 || quantity >= product.stock
                    ? "#ccc"
                    : "black"
                }
              />
            </TouchableOpacity>
            {product.stock === 0 && (
              <Text
                style={{
                  color: "#B22222",
                  fontWeight: "bold",
                  marginTop: 4,
                  marginLeft: 4,
                  fontSize: 20,
                }}
              >
                Out of stock
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Footer (Sticky at Bottom) */}
      <View style={styles.footer}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {/* Add to Favorites */}
          <FavoriteButton
            initialFavorite={false}
            onToggle={handleFavoriteChange}
          />
          {/* Add to Cart Button */}
          {!loggedIn && (
            <View
              style={{
                opacity:
                  product.stock === 0 || quantity > product.stock ? 0.5 : 1,
                marginHorizontal: "auto",
                width: "60%",
              }}
              pointerEvents={
                product.stock === 0 || quantity > product.stock
                  ? "none"
                  : "auto"
              }
            >
              <AppButton
                title="Add to cart"
                onPress={() => {
                  product && addToCart({ ...product, quantity });
                  Toast.show({
                    type: "success",
                    text1: "Added to cart!",
                    text2: `${product.name} x${quantity} was added.`,
                  });
                }}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the container take full height of the screen
    padding: 16,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 80, // Add some padding to make room for the footer
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    // Optional: Adjust the height of the footer
  },
  previewContainer: {
    width: "90%",
    height: 350,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  thumbnailWrapper: {
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeThumbnail: {
    borderColor: "#555",
    opacity: 1,
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    margin: 16,
  },
  image: {
    width: "100%",
    maxHeight: 400,
    resizeMode: "cover",
  },
  info: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  price: {
    fontSize: 18,
    color: "#10b981",
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: "bold",
  },
  reviewCount: {
    marginLeft: 8,
    color: "#6b7280",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    gap: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "500",
    width: 40,
    textAlign: "center",
  },
  desc: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "600",
  },
  description: {
    color: "#4b5563",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1e40af",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
