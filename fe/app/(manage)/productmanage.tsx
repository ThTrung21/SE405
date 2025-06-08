import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Header from '../../components/header';
import DropDownPicker from 'react-native-dropdown-picker';
import Colors from '../../constants/Colors';

const categories = [
  { key: 'all', label: 'Popular', icon: 'star' },
  { key: 'pets', label: 'Pets', icon: 'paw' },
  { key: 'proteine', label: 'Proteine', icon: 'restaurant' },
  { key: 'biscuit', label: 'Biscuit', icon: 'pizza' },
  { key: 'small', label: 'Small', icon: 'resize' },
  { key: 'large', label: 'Large', icon: 'resize-outline' },
];

const initialBrands = ['PetBrand', 'Doggy', 'Catty'];

type Product = {
  id: string;
  name: string;
  price: number;
  images: any[];
  category: string;
  description: string;
  brand: string;
  stock: number;
};

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Alaskan Malamute Grey',
    price: 12,
    images: [require('../../assets/dog1.png')],
    category: 'pets',
    description: '',
    brand: 'PetBrand',
    stock: 10,
  },
  {
    id: '2',
    name: 'Poodle Tiny Dairy Cow',
    price: 25,
    images: [require('../../assets/dog2.png')],
    category: 'pets',
    description: '',
    brand: 'Doggy',
    stock: 5,
  },
  {
    id: '3',
    name: 'Pomeranian White',
    price: 20,
    images: [require('../../assets/dog3.png')],
    category: 'small',
    description: '',
    brand: 'Catty',
    stock: 8,
  },
  {
    id: '4',
    name: 'Pomeranian White',
    price: 50,
    images: [require('../../assets/dog4.png')],
    category: 'large',
    description: '',
    brand: 'PetBrand',
    stock: 2,
  },
];

export default function ProductManage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [brands, setBrands] = useState(initialBrands);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
    name: '',
    price: '',
    description: '',
    images: [],
    category: '',
    brand: '',
    stock: '1',
  });
  const [showBrandInput, setShowBrandInput] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState<string | null>(null);
  const [categoryItems, setCategoryItems] = useState([
    { label: 'Pets', value: 'pets' },
    { label: 'Proteine', value: 'proteine' },
    { label: 'Biscuit', value: 'biscuit' },
    { label: 'Small', value: 'small' },
    { label: 'Large', value: 'large' },
  ]);
  const [brandOpen, setBrandOpen] = useState(false);
  const [brandValue, setBrandValue] = useState<string | null>(null);
  const [brandItems, setBrandItems] = useState<{ label: string; value: string }[]>(brands.map(b => ({ label: b, value: b })).concat([{ label: '+ Add new brand', value: '__add_new__' }]));
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const openAdd = () => {
    setForm({ name: '', price: '', description: '', images: [], category: '', brand: '', stock: '1' });
    setShowBrandInput(false);
    setNewBrand('');
    setCategoryValue(null);
    setBrandValue(null);
    setEditMode(false);
    setEditProductId(null);
    setModalVisible(true);
  };

  const openDetail = (item: Product) => {
    setSelectedProduct(item);
    setDetailModalVisible(true);
  };

  const openEdit = (item: Product) => {
    setForm({
      name: item.name,
      price: item.price.toString(),
      description: item.description,
      images: item.images,
      category: item.category,
      brand: item.brand,
      stock: item.stock?.toString() || '1',
    });
    setCategoryValue(item.category);
    setBrandValue(item.brand);
    setEditMode(true);
    setEditProductId(item.id);
    setModalVisible(true);
    setDetailModalVisible(false);
  };

  const openItemEdit = (item: Product) => {
    openEdit(item);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
            setProducts(products => products.filter(p => p.id !== id));
            setModalVisible(false);
            setEditMode(false);
            setEditProductId(null);
            setDetailModalVisible(false);
          }
        },
      ]
    );
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: false,
      quality: 1,
      selectionLimit: 5,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setForm((f) => ({ ...f, images: [...(f.images || []), ...result.assets.map(a => ({ uri: a.uri }))] }));
    }
  };

  const removeImage = (idx: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_: any, i: number) => i !== idx) }));
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.category || !form.brand || form.images.length === 0) {
      Alert.alert('Error', 'Please fill all fields and select at least one image!');
      return;
    }
    if (editMode && editProductId) {
      setProducts(products.map(p =>
        p.id === editProductId
          ? {
              ...p,
              name: form.name,
              price: parseFloat(form.price),
              images: form.images,
              category: form.category,
              description: form.description,
              brand: form.brand,
              stock: parseInt(form.stock) || 0,
            }
          : p
      ));
    } else {
      setProducts([
        ...products,
        {
          id: (Math.random() * 100000).toFixed(0),
          name: form.name,
          price: parseFloat(form.price),
          images: form.images,
          category: form.category,
          description: form.description,
          brand: form.brand,
          stock: parseInt(form.stock) || 0,
        },
      ]);
    }
    setModalVisible(false);
    setEditMode(false);
    setEditProductId(null);
  };

  const handleAddBrand = () => {
    if (newBrand.trim() && !brands.includes(newBrand.trim())) {
      setBrands([...brands, newBrand.trim()]);
      setBrandItems(items => [...items.filter(i => i.value !== '__add_new__'), { label: newBrand.trim(), value: newBrand.trim() }, { label: '+ Add new brand', value: '__add_new__' }]);
      setBrandValue(newBrand.trim());
      setForm(f => ({ ...f, brand: newBrand.trim() }));
      setShowBrandInput(false);
      setNewBrand('');
    }
  };

  useEffect(() => {
    setForm(f => ({ ...f, category: categoryValue || '' }));
  }, [categoryValue]);

  useEffect(() => {
    if (brandValue === '__add_new__') {
      setShowBrandInput(true);
    } else {
      setForm(f => ({ ...f, brand: brandValue || '' }));
      setShowBrandInput(false);
    }
  }, [brandValue]);

  return (
    <View style={styles.container}>
      <Header title="Manage Products" />
      {/* Nút dấu cộng ở góc phải trên */}
      <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
        <Ionicons name="add-circle" size={36} color="#003459" />
      </TouchableOpacity>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {/* Category filter */}
      <View style={styles.categoryRow}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item }: { item: { key: string; label: string; icon: any } }) => (
            <TouchableOpacity
              style={[styles.categoryBtn, selectedCategory === item.key && styles.categoryBtnActive]}
              onPress={() => setSelectedCategory(item.key)}
            >
              <Ionicons name={item.icon as any} size={20} color={selectedCategory === item.key ? '#fff' : '#222'} />
              <Text style={[styles.categoryLabel, selectedCategory === item.key && styles.activeCategoryLabel]}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {/* Product grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 18 }}
        contentContainerStyle={{ padding: 12, paddingBottom: 32 }}
        renderItem={({ item }: { item: Product }) => (
          <TouchableOpacity style={styles.card} onPress={() => openItemEdit(item)}>
            <Image source={item.images[0]} style={styles.cardImage} />
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardPrice}>$ {item.price.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>No products.</Text>}
      />
      {/* Modal Add Product */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{editMode ? 'Edit Product' : 'Add Product'}</Text>
            <ScrollView>
              <View style={styles.imagePickerRow}>
                {form.images.map((img, idx) => (
                  <View key={idx} style={styles.imageThumbWrap}>
                    <Image source={img} style={styles.imageThumb} />
                    <TouchableOpacity style={styles.removeImgBtn} onPress={() => removeImage(idx)}>
                      <Ionicons name="close-circle" size={20} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.addImgBtn} onPress={pickImages}>
                  <Ionicons name="add" size={28} color="#888" />
                  <Text style={{ color: '#888', fontSize: 12 }}>Add Image</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Product name"
                value={form.name}
                onChangeText={v => setForm(f => ({ ...f, name: v }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={form.description}
                onChangeText={v => setForm(f => ({ ...f, description: v }))}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Price"
                value={form.price}
                onChangeText={v => setForm(f => ({ ...f, price: v }))}
                keyboardType="numeric"
              />
              {/* Stock input with plus/minus */}
              <View style={styles.stockRow}>
                <Text style={{ fontWeight: '500', marginBottom: 4, marginRight: 8 }}>Stock</Text>
                <TouchableOpacity
                  style={styles.stockBtn}
                  onPress={() => setForm(f => ({ ...f, stock: Math.max(0, parseInt(f.stock || '0') - 1).toString() }))}
                >
                  <Ionicons name="remove" size={22} color="#003459" />
                </TouchableOpacity>
                <TextInput
                  style={styles.stockInput}
                  value={form.stock}
                  onChangeText={v => setForm(f => ({ ...f, stock: v.replace(/[^0-9]/g, '') }))}
                  keyboardType="numeric"
                  editable={true}
                  selectTextOnFocus={true}
                  inputMode="numeric"
                />
                <TouchableOpacity
                  style={styles.stockBtn}
                  onPress={() => setForm(f => ({ ...f, stock: (parseInt(f.stock || '0') + 1).toString() }))}
                >
                  <Ionicons name="add" size={22} color="#003459" />
                </TouchableOpacity>
              </View>
              {/* Dropdown category */}
              <View style={styles.dropdownWrap}>
                <Text style={{ fontWeight: '500', marginBottom: 4 }}>Category</Text>
                <DropDownPicker
                  open={categoryOpen}
                  value={categoryValue}
                  items={categoryItems}
                  setOpen={setCategoryOpen}
                  setValue={setCategoryValue}
                  setItems={setCategoryItems}
                  placeholder="Select category"
                  style={styles.input}
                  textStyle={{ fontWeight: 'bold', color: '#222', fontSize: 16 }}
                  dropDownContainerStyle={{ borderColor: '#E0E0E0', borderRadius: 8 }}
                  zIndex={2000}
                  zIndexInverse={1000}
                />
              </View>
              {/* Dropdown brand */}
              <View style={styles.dropdownWrap}>
                <Text style={{ fontWeight: '500', marginBottom: 4 }}>Brand</Text>
                <DropDownPicker
                  open={brandOpen}
                  value={brandValue}
                  items={brandItems}
                  setOpen={setBrandOpen}
                  setValue={setBrandValue}
                  setItems={setBrandItems}
                  placeholder="Select brand"
                  style={styles.input}
                  textStyle={{ fontWeight: 'bold', color: '#222', fontSize: 16 }}
                  dropDownContainerStyle={{ borderColor: '#E0E0E0', borderRadius: 8 }}
                  zIndex={1000}
                  zIndexInverse={2000}
                />
                {showBrandInput && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <TextInput
                      style={[styles.input, { flex: 1, marginBottom: 0 }]}
                      placeholder="New brand name"
                      value={newBrand}
                      onChangeText={setNewBrand}
                    />
                    <TouchableOpacity
                      style={{ marginLeft: 8, backgroundColor: '#17405C', borderRadius: 8, padding: 10 }}
                      onPress={handleAddBrand}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
              <TouchableOpacity onPress={() => { setModalVisible(false); setEditMode(false); setEditProductId(null); }} style={styles.cancelBtn}>
                <Text style={{ color: '#17405C', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              {editMode && editProductId && (
                <TouchableOpacity onPress={() => handleDelete(editProductId)} style={[styles.saveBtn, { backgroundColor: '#E57373', marginLeft: 8 }] }>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, editMode && editProductId ? { marginLeft: 16 } : null]}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{editMode ? 'Edit' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal chi tiết sản phẩm */}
      <Modal visible={detailModalVisible} animationType="slide" transparent>
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
                <Text style={{ fontWeight: 'bold', color: '#1e88e5', fontSize: 16, marginBottom: 8 }}>$ {selectedProduct.price.toFixed(2)}</Text>
                <Text style={{ marginBottom: 8 }}>{selectedProduct.description}</Text>
                <Text style={{ marginBottom: 4 }}><Text style={{ fontWeight: 'bold' }}>Category:</Text> {selectedProduct.category}</Text>
                <Text style={{ marginBottom: 4 }}><Text style={{ fontWeight: 'bold' }}>Brand:</Text> {selectedProduct.brand}</Text>
                <Text style={{ marginBottom: 12 }}><Text style={{ fontWeight: 'bold' }}>Stock:</Text> {selectedProduct.stock}</Text>
              </ScrollView>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)} style={styles.cancelBtn}>
                <Text style={{ color: '#17405C', fontWeight: 'bold' }}>Close</Text>
              </TouchableOpacity>
              {selectedProduct && (
                <TouchableOpacity onPress={() => openEdit(selectedProduct)} style={styles.saveBtn}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Edit</Text>
                </TouchableOpacity>
              )}
              {selectedProduct && (
                <TouchableOpacity onPress={() => handleDelete(selectedProduct.id)} style={[styles.saveBtn, { backgroundColor: '#E57373', marginLeft: 8 }] }>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 2,
    padding: 2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 8,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
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
    color: '#222',
    fontWeight: '500',
  },
  activeCategoryLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 8,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
    paddingBottom: 12,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: 'cover',
  },
  cardName: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 10,
    marginHorizontal: 10,
    color: '#222',
  },
  cardPrice: {
    fontSize: 15,
    color: '#1e88e5',
    marginTop: 4,
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#0006',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '90%',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#F5F5F7',
    fontWeight: 'bold',
    color: '#222',
  },
  imagePickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  addImgBtn: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    margin: 0,
  },
  imageThumbWrap: {
    position: 'relative',
    marginRight: 12,
    marginBottom: 8,
  },
  imageThumb: {
    width: 70,
    height: 70,
    borderRadius: 12,
    margin: 0,
    backgroundColor: '#F5F5F7',
  },
  removeImgBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    backgroundColor: '#fff',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownWrap: {
    marginBottom: 12,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#17405C',
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#17405C',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  stockBtn: {
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    padding: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  stockInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F5F5F7',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginHorizontal: 4,
    textAlign: 'center',
    padding: 0,
  },
}); 