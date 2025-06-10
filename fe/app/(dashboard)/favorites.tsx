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

const FavoritesScreen: React.FC = () => {
	const [showSearch, setShowSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const router = useRouter();
	//////////////////////////////////////////////////////////////
	const profile = useAuthStore((state) => state.profile);
	const isLoading = useAppStore((state) => state.isLoading);
	const setIsLoading = useAppStore((state) => state.setIsLoading);
	const setFilteredProducts = useProductStore(
		(state) => state.setFilteredProducts
	);
	const setProducts = useProductStore((state) => state.setProducts);
	const products = useProductStore((state) => state.products);

	//-========================================
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				console.log("Fetching products...");
				const productData = await getAllProducts();

				setProducts(productData.data);
				console.log("Products: \n", products);
			} catch (error) {
				console.error("Fetch error:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);
	// Remove pet from favorites
	const handleRemove = (id: string) => {
		// setPets((prev) => prev.filter((pet) => pet.id !== id));
	};

	const filteredPets = products.filter((pet) =>
		pet.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const renderItem = ({ item }: ListRenderItemInfo<IProduct>) => (
		<View style={styles.card}>
			<Image source={{ uri: item.images[0] }} style={styles.image} />

			<View style={styles.info}>
				<Text style={styles.name}>{item.name}</Text>
				<Text style={styles.price}>${item.price}</Text>
			</View>

			<View style={styles.actions}>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => handleRemove(item.id.toString())}
				>
					<Feather name="x-circle" size={18} color="#000" />
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			{/* Header with Search and Cart */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.headerIcon}
					onPress={() => setShowSearch((prev) => !prev)}
				>
					<Ionicons name="search" size={28} color="#003459" />
				</TouchableOpacity>
				<View style={styles.headerTitleWrapper}>
					{showSearch ? (
						<TextInput
							style={styles.headerSearchInput}
							placeholder="Search favorites..."
							value={searchQuery}
							onChangeText={setSearchQuery}
							autoFocus
						/>
					) : (
						<Text style={styles.headerTitle}>Favorites</Text>
					)}
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
					data={products}
					keyExtractor={(item) => item.id.toString()}
					renderItem={renderItem}
					contentContainerStyle={{ paddingBottom: 100 }}
					showsVerticalScrollIndicator={false}
					ListEmptyComponent={<Text>No favorites found.</Text>}
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
	},
	info: {
		flex: 1,
		justifyContent: "center",
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
});
