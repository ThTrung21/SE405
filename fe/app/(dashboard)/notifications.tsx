// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Image,
//   SafeAreaView,
//   ListRenderItemInfo,
// } from 'react-native';
// import NotificationHeader from '../../components/notificationHeader';

// // Define the type for a notification item
// type Notification = {
//   id: string;
//   type: 'order' | 'text-only';
//   image?: string;
//   title: string;
//   description: string;
//   label?: string;
//   labelColor?: string;
// };

// const notifications: Notification[] = [
//   {
//     id: '1',
//     type: 'order',
//     image: 'https://placedog.net/300/200?id=1',
//     title: 'Your order #123456789 has been confirmed',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//     label: 'NEW',
//     labelColor: '#28a745',
//   },
//   {
//     id: '2',
//     type: 'order',
//     image: 'https://placedog.net/300/200?id=2',
//     title: 'Your order #123456789 has been canceled',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//   },
//   {
//     id: '3',
//     type: 'text-only',
//     title: 'Discover hot sale furnitures this week.',
//     description:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis pretium et in arcu adipiscing nec.',
//     label: 'HOT!',
//     labelColor: '#dc3545',
//   },
//   {
//     id: '4',
//     type: 'order',
//     image: 'https://placedog.net/300/200?id=3',
//     title: 'Your order #123456789 has been shipped successfully',
//     description:
//       'Please help us to confirm and rate your order to get 10% discount code for next order.',
//   },
//   // ... other notifications
// ];

// const NotificationScreen: React.FC = () => {
//   // Add type to renderItem param using ListRenderItemInfo
//   const renderItem = ({ item }: ListRenderItemInfo<Notification>) => {
//     return (
//       <View style={styles.notification}>
//         {item.type === 'order' && item.image && (
//           <Image source={{ uri: item.image }} style={styles.image} />
//         )}

//         <View style={styles.textWrapper}>
//           <Text style={styles.title}>{item.title}</Text>
//           <Text style={styles.description}>{item.description}</Text>
//         </View>

//         {item.label && (
//           <Text style={[styles.label, { color: item.labelColor }]}>
//             {item.label}
//           </Text>
//         )}
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <NotificationHeader title="Notifications" />
//       <View style={{ marginTop: 20 }}>
//         {/* List */}
//         <FlatList
//           data={notifications}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           contentContainerStyle={{ paddingBottom: 20 }}
//           showsVerticalScrollIndicator={false}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default NotificationScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingVertical: 24
//   },
//   notification: {
//     flexDirection: 'row',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderBottomWidth: 0.5,
//     borderColor: '#ddd',
//     alignItems: 'center',
//   },
//   image: {
//     width: 60,
//     height: 60,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   textWrapper: {
//     flex: 1,
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 14,
//     marginBottom: 4,
//   },
//   description: {
//     fontSize: 13,
//     color: '#666',
//   },
//   label: {
//     fontWeight: 'bold',
//     marginLeft: 6,
//   },
// });
