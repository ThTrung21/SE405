import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInputProps,
} from 'react-native';
import { Link } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import AppButton from '../../components/appButton';

const SignUpScreen: React.FC = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </View>

      <Text style={styles.welcome}>WELCOME BACK</Text>

      <View style={styles.form}>
        <View style={{ paddingBottom: 40 }}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#999"
            autoCapitalize="words"
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputField}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputField}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
            </TouchableOpacity>
          </View>
        </View>
        <AppButton title="SIGN UP" onPress={() => console.log('Sign Up pressed')} />

        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text
            onPress={() => router.replace('login')}
            style={styles.linkText}
          >
            SIGN IN
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  welcome: {
    paddingHorizontal: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 24,
  },
  form: {
    backgroundColor: '#fdfdfd',
    padding: 16,
  },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
  },
  inputField: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
  linkText: {
    fontWeight: 'bold',
    color: '#003366',
  },
});
