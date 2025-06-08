import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInputProps,
} from "react-native";
import { Link } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useRouter } from "expo-router";

import AppButton from "../../components/appButton";
import { useAppStore } from "stores/useAppStore";
import { signUp } from "apis/auth.api";
import Toast from "react-native-toast-message";

const SignUpScreen: React.FC = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [repeatPassword, setrepeatPassword] = useState("");

  const handleSignup = async () => {
    try {
      if (password != repeatPassword) {
        Toast.show({
          type: "error",
          text1: "Passwords doesn't match",
          visibilityTime: 20000,
        });
        return;
      }
      if (password.length < 8) {
        Toast.show({
          type: "error",
          text1: "Passwords must be >= 8 characters",
          visibilityTime: 3000,
        });
        return;
      }
      const payload = {
        email: emailInput,
        password: password,
        phone: phone,
        fullname: name,
      };
      await signUp(payload);
      setIsLoading(false);
      Toast.show({
        type: "success",
        text1: "Create new account successfully!",
        visibilityTime: 1000,
        onHide: () => router.push("/login"),
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error creating a new account",
        text2: "Please try again",
        visibilityTime: 3000,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
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
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={emailInput}
            onChangeText={setEmailInput}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            value={phone}
            onChangeText={setPhone}
          />
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputField}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color="#666" />
              ) : (
                <Eye size={20} color="#666" />
              )}
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
              value={repeatPassword}
              onChangeText={setrepeatPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? (
                <EyeOff size={20} color="#666" />
              ) : (
                <Eye size={20} color="#666" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <AppButton title="SIGN UP" onPress={handleSignup} />

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text onPress={() => router.replace("login")} style={styles.linkText}>
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
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  welcome: {
    paddingHorizontal: 20,
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 24,
  },
  form: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 32,
    paddingVertical: 8,
  },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 16,
    fontSize: 16,
    padding: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 16,
  },
  inputField: {
    flex: 1,
    height: 48,
    fontSize: 16,
    padding: 12,
  },
  footerText: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
  },
  linkText: {
    fontWeight: "bold",
    color: "#003366",
  },
});
