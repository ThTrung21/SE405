import React from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BlurView } from 'expo-blur'
import { Link } from 'expo-router'
import AppButton from 'components/appButton'

const WelcomeScreen: React.FC = () => {
  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <BlurView intensity={30} tint="light" style={styles.overlay}>
        <View style={styles.contentBox}>
          <Text style={styles.subtitle}>
            <Text style={{ color: '#333' }}>One</Text> more friend
          </Text>
          <Text style={styles.title}>Thousands more fun!</Text>
          <Text style={styles.description}>
            The best simple place where you discover most wonderful furnitures and make your home beautiful
          </Text>
        </View>

        <AppButton title="Get Started" variant='starter' href='login' />


        <Link href="homepage" asChild>
            <Text style={styles.buttonText}>Home</Text>
        </Link>
      </BlurView>
    </ImageBackground>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  contentBox: {
    backgroundColor: 'rgba(255, 245, 225, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#666',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: '#003366',
    marginTop: 12,
    lineHeight: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
