"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageSourcePropType,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import MainHeader from "../../components/mainHeader";
import { useAppStore } from "stores/useAppStore";
import { useProductStore } from "stores/useProductStore";
import { useCategoriesStore } from "stores/useCategoryStore";
import { useBrandStore } from "stores/useBrandStore";
import {
  getAllProducts,
  getFilteredProduct,
  searchProductsByName,
} from "apis/product.api";
import { getAllCategories } from "apis/category.api";
import { getAllBrands } from "apis/brand.api";
import { IProduct } from "interfaces/IProduct";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PanGestureHandler } from "react-native-gesture-handler";
import Colors from "constants/Colors";
export const categories = [
  {
    label: "All",
    icon: "menu",
    idnumber: 0,
  },
  {
    label: "Dog Food",
    icon: "dog",
    idnumber: 1,
  },
  {
    label: "Cat Food",
    icon: "cat",
    idnumber: 2,
  },
  {
    label: "Bird Suplies",
    icon: "bird",
    idnumber: 3,
  },
  {
    label: "Fish & Aquatic",
    icon: "fishbowl-outline",
    idnumber: 4,
  },
  {
    // need edit later
    label: "Small Pet",
    icon: "cheese",
    idnumber: 5,
  },
  {
    // need edit later
    label: "Reptile",
    icon: "ab-testing",
    idnumber: 6,
  },
  {
    label: "Toys",
    icon: "toy-brick",
    idnumber: 7,
  },
  {
    label: "Grooming",
    icon: "dog",
    idnumber: 8,
  },
  {
    label: "Furniture",
    icon: "table-furniture",
    idnumber: 9,
  },
  {
    label: "Medincine",
    icon: "pill",
    idnumber: 10,
  },
  {
    label: "Carriers",
    icon: "bag-personal",
    idnumber: 11,
  },
  {
    label: "Collars",
    icon: "dog-service",
    idnumber: 12,
  },
];

// const categories: Category[] = [
//   { label: "Popular", icon: "star-outline", activeIcon: "star" },
//   { label: "Pets", icon: "paw-outline", activeIcon: "paw" },
//   { label: "Proteine", icon: "restaurant-outline", activeIcon: "restaurant" },
//   { label: "Biscuit", icon: "pizza-outline", activeIcon: "pizza" },
//   { label: "Small", icon: "pricetag-outline", activeIcon: "pricetag" },
//   { label: "Large", icon: "pricetags-outline", activeIcon: "pricetags" },
// ];

export default function Homepage() {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  const setFilteredProducts = useProductStore(
    (state) => state.setFilteredProducts
  );
  const setProducts = useProductStore((state) => state.setProducts);
  const setSortBy = useProductStore((state) => state.setSortBy);
  const setCategories = useCategoriesStore((state) => state.setCategories);

  // const categories = useCategoriesStore((state) => state.setCategories);
  const filteredProducts = useProductStore((state) => state.filteredProducts);
  const products = useProductStore((state) => state.products);
  const setBrands = useBrandStore((state) => state.setBrands);
  const [searchValue, setSearchValue] = useState<string>("");
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching products...");
        const productData = await getAllProducts();
        // const categoryData = await getAllCategories();
        // const brandData = await getAllBrands();
        setProducts(productData.data);
        console.log("Products: \n", products);
        // setCategories(categoryData);
        // setBrands(brandData);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  ///search
  const handleSearchProduct = async () => {
    setIsLoading(true);
    try {
      if (searchValue && searchValue !== "") {
        const { data } = await searchProductsByName(searchValue);
        setProducts(data);
      } else {
        const { data } = await getAllProducts();
        setProducts(data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  //filter by category
  const handleFilterProduct = async (categoryId: number, index: number) => {
    setSelectedCategoryIndex(index);
    setIsLoading(true);
    try {
      let filtered;
      if (categoryId != 0) filtered = await getFilteredProduct(categoryId);
      else filtered = await getAllProducts();
      setProducts(filtered.data);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const router = useRouter();

  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <MainHeader title="Products" />
      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color="#555"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
          placeholderTextColor="#888"
          onSubmitEditing={handleSearchProduct}
        />
      </View>
      <View style={{ height: 120 }}>
        {/*Search box  */}

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          scrollEnabled={true}
        >
          {categories.map((item, index) => {
            const isActive = index === selectedCategoryIndex;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.categoryItem]}
                onPress={() => handleFilterProduct(item.idnumber, index)}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    isActive && styles.activeIconWrapper,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={28}
                    color={isActive ? "#000" : "#555"}
                  />
                </View>
                <Text
                  style={[styles.categoryLabel, isActive && styles.activeLabel]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      {/* Pet Grid */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(stack)/item",
                  params: { id: item.id },
                })
              }
              style={{ flex: 1 }} // Make TouchableOpacity take up the whole card
            >
              <View>
                <Image source={{ uri: item.images[0] }} style={styles.image} />
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/(stack)/item",
                      params: { id: item.id },
                    })
                  }
                  style={styles.cartButton}
                >
                  <Ionicons name="bag-handle" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.petName}>{item.name}</Text>
              <Text style={styles.petPrice}>${item.price}</Text>
            </TouchableOpacity>
          </View>
        )}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12,
    minHeight: 40,
  },
  exploreTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003459',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'System',
  },
  cartIcon: {
    position: 'absolute',
    right: 24,
    top: 0,
    padding: 4,
    zIndex: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    height: 52,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    fontFamily: 'System',
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
  },
  bannerImage: {
    width: '100%',
    height: 120,
    borderRadius: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
  },
  searchContainer: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    marginHorizontal: 16,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    fontSize: 14,

    color: "#000",
  },
  // scrollContainer: {
  //   // Enable touch-action for horizontal pan dragging on web
  //   touchAction: "pan-x",
  //   cursor: "grab" as any,
  // },
  mainheader: {
    backgroundColor: "red",
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
    minWidth: 80,
  },
  iconWrapper: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 14,
  },
  activeIconWrapper: {
    backgroundColor: "#FAD69C", // light yellow
  },
  categoryLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  activeLabel: {
    color: "#000",
    fontWeight: "bold",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  petName: {
    fontSize: 13,
    fontWeight: "500",
    paddingHorizontal: 8,
    marginTop: 6,
  },
  petPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: "#003366",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  cartButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#808080",
    borderRadius: 6,
    padding: 6,
    opacity: 0.6,
  },
});
