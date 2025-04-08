import React from 'react';
import { View, Text, StyleSheet, Image, AccessibilityProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppButton from '../../components/appButton';

const OrderSuccessScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SUCCESS!</Text>

      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/6612/6612696.png',
        }}
        style={styles.illustration}
        accessibilityLabel="Success illustration"
      />

      <Ionicons
        name="checkmark-circle"
        size={48}
        color="green"
        style={styles.checkmark}
        accessibilityLabel="Success checkmark icon"
      />

      <Text style={styles.message} accessibilityRole="text">
        Your order will be delivered soon.{"\n"}Thank you for choosing our app!
      </Text>

      <AppButton
        title="Track your orders"
        href="/orders"
      />

      <View style={{ marginTop: 12 }}>
        <AppButton
          title="BACK TO HOME"
          href="/homepage"
          variant='secondary'
        />
      </View>
    </View>
  );
};

export default OrderSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  illustration: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  checkmark: {
    marginVertical: 16,
  },
  message: {
    textAlign: 'center',
    fontSize: 15,
    color: '#4b5563',
    marginVertical: 16,
  },
});
