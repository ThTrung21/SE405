import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BlurView } from 'expo-blur'
import { Link } from 'expo-router'
import AppButton from 'components/appButton'
import Svg, { Path } from 'react-native-svg'

const Paw = ({ style, size = 40, color = '#fff' }: { style?: any; size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <Path d="M20 30c-3 0-6-2-6-5s3-5 6-5 6 2 6 5-3 5-6 5z" fill={color} />
    <Path d="M10 18c-2 0-3-1-3-3s1-3 3-3 3 1 3 3-1 3-3 3z" fill={color} />
    <Path d="M30 18c-2 0-3-1-3-3s1-3 3-3 3 1 3 3-1 3-3 3z" fill={color} />
    <Path d="M8 27c-1.5 0-2.5-1-2.5-2.5S6.5 22 8 22s2.5 1 2.5 2.5S9.5 27 8 27z" fill={color} />
    <Path d="M32 27c-1.5 0-2.5-1-2.5-2.5S30.5 22 32 22s2.5 1 2.5 2.5S33.5 27 32 27z" fill={color} />
  </Svg>
)

const WelcomeScreen: React.FC = () => {
  return (
    <View style={styles.background}>
      {/* Paw decorations */}
      <Paw style={[styles.paw, styles.pawTopRight]} size={56} color="#fff" />
      <Paw style={[styles.paw, styles.pawMidRight]} size={36} color="#fff" />
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
    </View>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FAD69C',
    position: 'relative',
  },
  paw: {
    position: 'absolute',
    zIndex: 1,
    opacity: 0.7,
  },
  pawTopRight: {
    top: 0,
    right: 0,
  },
  pawMidRight: {
    top: 120,
    right: 24,
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
