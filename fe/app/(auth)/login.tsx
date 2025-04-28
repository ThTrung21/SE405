import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextStyle,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { Link } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';

import AppButton from '../../components/appButton';

const LoginScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo as ImageStyle} />
      </View>

      <Text style={styles.greeting}>Hello !</Text>
      <Text style={styles.welcome}>WELCOME BACK</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
        />
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
          />
        </View>

        <TouchableOpacity
          style={{ alignSelf: 'flex-end' }}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff size={20} color="#666" />
          ) : (
            <Eye size={20} color="#666" />
          )}
        </TouchableOpacity>

        <Link href="" style={{ alignSelf: 'flex-end' }}>
          <TouchableOpacity onPress={() => console.log('Forgot Password pressed')}>
            <Text style={styles.linkText}>Forgot Password</Text>
          </TouchableOpacity>
        </Link>

        <AppButton title="Log in" onPress={() => console.log('Login pressed')} />

        <AppButton title="SIGN UP" href="signup" variant='secondary' />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

type Style = {
  container: ViewStyle;
  logoContainer: ViewStyle;
  logo: ImageStyle;
  greeting: TextStyle;
  welcome: TextStyle;
  form: ViewStyle;
  input: TextStyle;
  linkText: TextStyle;
  inputWrapper: ViewStyle;
  inputField: TextStyle;
};

const styles = StyleSheet.create<Style>({
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
  greeting: {
    paddingHorizontal: 20,
    fontSize: 24,
    color: '#666',
    marginBottom: 4,
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
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 18,
    fontSize: 16,
  },
  linkText: {
    color: '#003459',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontStyle: 'italic',
    textDecorationLine: 'underline'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
});
