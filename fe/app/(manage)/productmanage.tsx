import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Header from "../../components/header";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import Colors from "../../constants/Colors";
import { SubManagementHeader } from "components/managementHeader";
import { categories } from "app/(dashboard)/homepage";
import { useAppStore } from "stores/useAppStore";
import {
  createNewProduct,
  getAllProducts,
  getFilteredProduct,
  searchProductsByName,
} from "apis/product.api";
import { getAllBrands } from "apis/brand.api";
import { router } from "expo-router";
import { useProductStore } from "stores/useProductStore";
import { useBrandStore } from "stores/useBrandStore";
import { IProduct } from "interfaces/IProduct";
import { IBrand } from "interfaces/IBrand";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { uriToBlob } from "app/(dashboard)/profile";
import { app } from "utils/firebase";
import Toast from "react-native-toast-message";

export default function ProductManage() {
  //initial store
  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);
  //search and filter
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);

  //modal
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    price: string;
    description: string;
    images: any[];
    category: string;
    brand: string;
    stock: string;
  }>({
    name: "",
    price: "",
    description: "",
    images: [],
    category: "",
    brand: "",
    stock: "1",
  });

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  // const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  //search product by name
  const handleSearchProduct = async () => {
    setSelectedCategoryIndex(0);
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
  //filter product
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

  ///////////////////categories//////////////////////////////////////////

  const categoryOptions = categories.slice(1).map((cat) => ({
    label: cat.label,
    value: cat.idnumber.toString(), // DropDownPicker expects value to be a string
  }));
  const [categoryValue, setCategoryValue] = useState<string | null>(null);
  const selectedCategory = categories.find(
    (cat) => cat.idnumber.toString() === categoryValue
  );
  ///////////////////////////
  //
  //
  //
  /////////brands////////////
  interface DropdownItem {
    label: string;
    value: string;
  }
  const brands = useBrandStore((state) => state.brands); // official brands from store
  const setBrands = useBrandStore((state) => state.setBrands);

  const initialBrandItems: DropdownItem[] = [
    ...brands.map((b) => ({ label: b.name, value: b.id.toString() })),
    { label: "+ Add new brand", value: "__add_new__" },
  ];

  const [brandItems, setBrandItems] = useState(initialBrandItems);
  const [brandValue, setBrandValue] = useState<string | null>(null);
  const [newBrand, setNewBrand] = useState("");
  const [showBrandInput, setShowBrandInput] = useState(false);
  const [newBrands, setNewBrands] = useState<IBrand[]>([]);
  useEffect(() => {
    setBrandItems([
      ...brands.map((b) => ({ label: b.name, value: b.id.toString() })),
      { label: "+ Add new brand", value: "__add_new__" },
    ]);
  }, [brands]);
  const handleAddBrand = () => {
    const trimmed = newBrand.trim();
    if (
      trimmed &&
      !brandItems.find((i) => i.label.toLowerCase() === trimmed.toLowerCase())
    ) {
      const tempId = Date.now(); // Temporary numeric ID
      const newBrandItem: IBrand = { id: tempId, name: trimmed }; // Create new brand object

      // Add to local newBrands state
      setNewBrands((prev) => [...prev, newBrandItem]);

      // Update brandItems for the dropdown
      setBrandItems((items) => [
        ...items.filter((i) => i.value !== "__add_new__"),
        { label: trimmed, value: tempId.toString() }, // Convert tempId to string
        { label: "+ Add new brand", value: "__add_new__" },
      ]);

      // Update the store (optional, if you want to persist immediately)
      setBrands([...brands, newBrandItem]);

      // Update form and reset inputs
      setBrandValue(tempId.toString()); // Convert to string for dropdown
      setForm((f) => ({ ...f, brand: trimmed }));
      setShowBrandInput(false);
      setNewBrand("");
    }
  };

  //////////////////
  //
  //
  //
  const openAdd = () => {
    setForm({
      name: "",
      price: "",
      description: "",
      images: [],
      category: "",
      brand: "",
      stock: "1",
    });
    setShowBrandInput(false);
    setNewBrand("");
    setCategoryValue(null);
    setBrandValue(null);
    setEditMode(false);
    setEditProductId(null);
    setModalVisible(true);
  };

  const openDetail = (item: IProduct) => {
    // setSelectedProduct(item);
    setDetailModalVisible(true);
  };

  // const openEdit = (item: IProduct) => {
  //   setForm({
  //     name: item.name,
  //     price: item.price.toString(),
  //     description: item.description,
  //     images: item.images,
  //     category: item.category,
  //     brand: item.brand,
  //     stock: item.stock?.toString() || "1",
  //   });
  //   setCategoryValue(item.category);
  //   setBrandValue(item.brand);
  //   setEditMode(true);
  //   setEditProductId(item.id);
  //   setModalVisible(true);
  //   setDetailModalVisible(false);
  // };

  // const openItemEdit = (item: IProduct) => {
  //   openEdit(item);
  // };

  // const handleDelete = (id: string) => {
  //   Alert.alert(
  //     "Delete Product",
  //     "Are you sure you want to delete this product?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       {
  //         text: "Delete",
  //         style: "destructive",
  //         onPress: () => {
  //           setProducts((products) => products.filter((p) => p.id !== id));
  //           setModalVisible(false);
  //           setEditMode(false);
  //           setEditProductId(null);
  //           setDetailModalVisible(false);
  //         },
  //       },
  //     ]
  //   );
  // };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: false,
      quality: 1,
      selectionLimit: 5,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setForm((f) => ({
        ...f,
        images: [
          ...(f.images || []),
          ...result.assets.map((a) => ({ uri: a.uri })),
        ],
      }));
    }
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_: any, i: number) => i !== idx),
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    console.log("start");
    console.log("AAAA: ", form.images);

    if (editMode && editProductId) {
      // setProducts(
      //   products.map((p) =>
      //     p.id === editProductId
      //       ? {
      //           ...p,
      //           name: form.name,
      //           price: parseFloat(form.price),
      //           images: form.images,
      //           category: form.category,
      //           description: form.description,
      //           brand: form.brand,
      //           stock: parseInt(form.stock) || 0,
      //         }
      //       : p
      //   )
      // );
    }
    //add
    else {
      let payload: any = {
        name: form.name,
        desc: form.description,
        price: Number(form.price),
        brandId: Number(brandValue),
        categoryId: Number(categoryValue),

        importPrice: 0,
        stock: Number(form.stock),
        score: 0,
      };
      console.log(payload);
      try {
        if (form.images && form.images.length > 0) {
          const storage = getStorage(app);
          const uploadedUrls: string[] = [];

          for (const img of form.images) {
            const blob = await uriToBlob(img.uri);
            const filename = img.uri.split("/").pop();
            const storageRef = ref(
              storage,
              `petshop/gallery/${Date.now()}_${filename}`
            );

            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            uploadedUrls.push(downloadURL);
          }

          payload = { ...payload, images: uploadedUrls }; // attach the image URLs
        }
        await createNewProduct(payload);
        Toast.show({
          type: "success",
          text1: "Create new product successfully!",
          visibilityTime: 1000,
        });
      } catch (err) {
        console.error("Error uploading images", err);
        Toast.show({
          type: "error",
          text1: "Error. Something went wrong",
          visibilityTime: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(false);
    setModalVisible(false);
    setEditMode(false);
    setEditProductId(null);
  };

  useEffect(() => {
    setForm((f) => ({ ...f, category: categoryValue || "" }));
  }, [categoryValue]);

  // useEffect(() => {
  //   if (brandValue === "__add_new__") {
  //     setShowBrandInput(true);
  //   } else {
  //     setForm((f) => ({ ...f, brand: brandValue || "" }));
  //     setShowBrandInput(false);
  //   }
  // }, [brandValue]);
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
      }
    })();

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const productData = await getAllProducts();
        const brandData = await getAllBrands();
        setProducts(productData.data);
        setBrands(brandData.data);
        console.log(brands);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <SubManagementHeader title="Manage Products" />

      <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
        <Ionicons name="add-circle" size={36} color="#003459" />
      </TouchableOpacity>

      {/* Search bar */}
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
      {/* Category filter */}
      <View style={{ height: 120 }}>
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
      {/* Product grid */}
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
              style={{ flex: 1 }} // Make TouchableOpacity take up the whole card
            >
              <View>
                <Image source={{ uri: item.images[0] }} style={styles.image} />
              </View>
              <Text style={styles.petName}>{item.name}</Text>
              <Text style={styles.petPrice}>${item.price}</Text>
            </TouchableOpacity>
          </View>
        )}
        style={{ flex: 1 }}
      />

      {/* Modal Add Product */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editMode ? "Edit Product" : "Add Product"}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.imagePickerRow}>
                {form.images.map((img, idx) => (
                  <View key={idx} style={styles.imageThumbWrap}>
                    <Image source={img} style={styles.imageThumb} />
                    <TouchableOpacity
                      style={styles.removeImgBtn}
                      onPress={() => removeImage(idx)}
                    >
                      <Ionicons name="close-circle" size={20} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.addImgBtn} onPress={pickImages}>
                  <Ionicons name="add" size={28} color="#888" />
                  <Text style={{ color: "#888", fontSize: 12 }}>Add Image</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Product name"
                placeholderTextColor="#999"
                value={form.name}
                onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                placeholderTextColor="#999"
                value={form.description}
                onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Price"
                placeholderTextColor="#999"
                value={form.price}
                onChangeText={(v) => setForm((f) => ({ ...f, price: v }))}
                keyboardType="numeric"
              />
              {/* Stock input with plus/minus */}
              <View style={styles.stockRow}>
                <Text
                  style={{ fontWeight: "500", marginBottom: 4, marginRight: 8 }}
                >
                  Stock
                </Text>
                <TouchableOpacity
                  style={styles.stockBtn}
                  onPress={() =>
                    setForm((f) => ({
                      ...f,
                      stock: Math.max(
                        0,
                        parseInt(f.stock || "0") - 1
                      ).toString(),
                    }))
                  }
                >
                  <Ionicons name="remove" size={22} color="#003459" />
                </TouchableOpacity>
                <TextInput
                  style={styles.stockInput}
                  value={form.stock}
                  onChangeText={(v) =>
                    setForm((f) => ({ ...f, stock: v.replace(/[^0-9]/g, "") }))
                  }
                  keyboardType="numeric"
                  editable={true}
                  selectTextOnFocus={true}
                  inputMode="numeric"
                />
                <TouchableOpacity
                  style={styles.stockBtn}
                  onPress={() =>
                    setForm((f) => ({
                      ...f,
                      stock: (parseInt(f.stock || "0") + 1).toString(),
                    }))
                  }
                >
                  <Ionicons name="add" size={22} color="#003459" />
                </TouchableOpacity>
              </View>
              {/* Dropdown category */}
              <View style={styles.dropdownWrap1}>
                <Text style={{ fontWeight: "500", marginBottom: 4 }}>
                  Category
                </Text>
                <DropDownPicker
                  open={categoryOpen}
                  value={categoryValue}
                  items={categoryOptions}
                  setOpen={setCategoryOpen}
                  setValue={setCategoryValue}
                  placeholder="Select category"
                  style={styles.input}
                  textStyle={{
                    fontWeight: "bold",
                    color: "#222",
                    fontSize: 16,
                  }}
                  dropDownContainerStyle={{
                    borderColor: "#E0E0E0",
                    borderRadius: 8,
                  }}
                  zIndex={10}
                  // zIndexInverse={400}
                />
              </View>
              {/* Dropdown brand */}
              <View style={styles.dropdownWrap2}>
                <Text style={{ fontWeight: "500", marginBottom: 4 }}>
                  Brand
                </Text>

                <DropDownPicker
                  open={brandOpen}
                  value={brandValue}
                  items={brandItems}
                  setOpen={setBrandOpen}
                  setValue={setBrandValue}
                  setItems={setBrandItems}
                  placeholder="Select brand"
                  onChangeValue={(val) => {
                    if (val === "__add_new__") {
                      setShowBrandInput(true);
                      setBrandValue(null); // optional: clear selection
                    } else {
                      setShowBrandInput(false);
                      const selected = brandItems.find((b) => b.value === val);
                      if (selected) {
                        setForm((f) => ({ ...f, brand: selected.label }));
                      }
                    }
                  }}
                  style={styles.input}
                  textStyle={{
                    fontWeight: "bold",
                    color: "#222",
                    fontSize: 16,
                  }}
                  dropDownContainerStyle={{
                    borderColor: "#E0E0E0",
                    borderRadius: 8,
                  }}
                  zIndex={5}
                  // zIndexInverse={2000}
                />

                {/* Show Input Field when "Add new brand" selected */}
                {showBrandInput && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <TextInput
                      style={[styles.input, { flex: 1, marginBottom: 0 }]}
                      placeholder="New brand name"
                      value={newBrand}
                      onChangeText={setNewBrand}
                    />
                    <TouchableOpacity
                      style={{
                        marginLeft: 8,
                        backgroundColor: "#17405C",
                        borderRadius: 8,
                        padding: 10,
                      }}
                      onPress={handleAddBrand}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditMode(false);
                  setEditProductId(null);
                }}
                style={styles.cancelBtn}
              >
                <Text style={{ color: "#17405C", fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                style={[
                  styles.saveBtn,
                  editMode && editProductId ? { marginLeft: 16 } : null,
                ]}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal chi tiết sản phẩm */}
      {/* <Modal visible={detailModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selectedProduct && (
              <ScrollView>
                <View style={styles.imagePickerRow}>
                  {selectedProduct.images.map((img: any, idx: number) => (
                    <Image key={idx} source={img} style={styles.imageThumb} />
                  ))}
                </View>
                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#1e88e5",
                    fontSize: 16,
                    marginBottom: 8,
                  }}
                >
                  $ {selectedProduct.price.toFixed(2)}
                </Text>
                <Text style={{ marginBottom: 8 }}>
                  {selectedProduct.description}
                </Text>
                <Text style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: "bold" }}>Category:</Text>{" "}
                  {selectedProduct.category}
                </Text>
                <Text style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: "bold" }}>Brand:</Text>{" "}
                  {selectedProduct.brand}
                </Text>
                <Text style={{ marginBottom: 12 }}>
                  <Text style={{ fontWeight: "bold" }}>Stock:</Text>{" "}
                  {selectedProduct.stock}
                </Text>
              </ScrollView>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => setDetailModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={{ color: "#17405C", fontWeight: "bold" }}>
                  Close
                </Text>
              </TouchableOpacity>
              {selectedProduct && (
                <TouchableOpacity
                  onPress={() => openEdit(selectedProduct)}
                  style={styles.saveBtn}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Edit
                  </Text>
                </TouchableOpacity>
              )}
              {selectedProduct && (
                <TouchableOpacity
                  onPress={() => handleDelete(selectedProduct.id)}
                  style={[
                    styles.saveBtn,
                    { backgroundColor: "#E57373", marginLeft: 8 },
                  ]}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    position: "absolute",
    top: 18,
    right: 18,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 2,
    padding: 2,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  // searchInput: {
  //   flex: 1,
  //   fontSize: 16,
  //   color: "#222",
  //   fontWeight: "bold",
  // },
  categoryRow: {
    flexDirection: "row",
    marginBottom: 12,
    paddingLeft: 8,
  },
  categoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryBtnActive: {
    backgroundColor: Colors.accent,
  },
  categoryLabel: {
    marginLeft: 6,
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },
  activeCategoryLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 8,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
    paddingBottom: 12,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: "cover",
  },
  cardName: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 10,
    marginHorizontal: 10,
    color: "#222",
  },
  cardPrice: {
    fontSize: 15,
    color: "#1e88e5",
    marginTop: 4,
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#0006",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 24,
    width: "90%",
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#F5F5F7",
    fontWeight: "bold",
    color: "#222",
  },
  imagePickerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  addImgBtn: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#F5F5F7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    margin: 0,
  },
  imageThumbWrap: {
    position: "relative",
    marginRight: 12,
    marginBottom: 8,
  },
  imageThumb: {
    width: 70,
    height: 70,
    borderRadius: 12,
    margin: 0,
    backgroundColor: "#F5F5F7",
  },
  removeImgBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    backgroundColor: "#fff",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownWrap1: {
    marginBottom: 12,
    zIndex: 10,
    position: "relative", // REQUIRED to apply zIndex in RN
  },
  dropdownWrap2: {
    marginBottom: 12,
    zIndex: 5,
    position: "relative", // REQUIRED to apply zIndex in RN
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#17405C",
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#17405C",
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 4,
  },
  stockBtn: {
    backgroundColor: "#F5F5F7",
    borderRadius: 8,
    padding: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  stockInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F5F5F7",
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginHorizontal: 4,
    textAlign: "center",
    padding: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 24,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 12,
    minHeight: 40,
  },
  exploreTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#003459",
    textAlign: "center",
    flex: 1,
    fontFamily: "System",
  },
  cartIcon: {
    position: "absolute",
    right: 24,
    top: 0,
    padding: 4,
    zIndex: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    height: 52,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
    fontFamily: "System",
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    backgroundColor: "#fff",
  },
  bannerImage: {
    width: "100%",
    height: 120,
    borderRadius: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
  },

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
  // categoryLabel: {
  //   fontSize: 12,
  //   color: "#888",
  //   fontWeight: "500",
  // },
  activeLabel: {
    color: "#000",
    fontWeight: "bold",
  },
  // card: {
  //   width: "48%",
  //   backgroundColor: "#fff",
  //   borderRadius: 10,
  //   marginBottom: 20,
  //   overflow: "hidden",
  //   position: "relative",
  // },
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
