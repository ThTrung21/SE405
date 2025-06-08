"use client";
import React, { useContext, useState } from "react";
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
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { AuthContext } from "../../context/AuthProvider";
import AppButton from "../../components/appButton";
import { useAppStore } from "stores/useAppStore";

const LoginScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  // const [form] = Form.useForm();
  const { logIn } = useContext(AuthContext) as any;
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setpasswordInput] = useState("");
  const isLoading = useAppStore((state) => state.isLoading);

  const handleLogin = async () => {
    const payload = {
      email: emailInput,
      password: passwordInput,
    };
    await logIn(payload);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo as ImageStyle}
        />
      </View>

      <Text style={styles.greeting}>Hello !</Text>
      <Text style={styles.welcome}>WELCOME BACK</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={emailInput}
          onChangeText={setEmailInput}
        />
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={passwordInput}
            onChangeText={setpasswordInput}
          />
        </View>

        <TouchableOpacity
          style={{ alignSelf: "flex-end" }}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff size={20} color="#666" />
          ) : (
            <Eye size={20} color="#666" />
          )}
        </TouchableOpacity>

        {/* <Link href="" style={{ alignSelf: "flex-end" }}>
          <TouchableOpacity
            onPress={() => console.log("Forgot Password pressed")}
          >
            <Text style={styles.linkText}>Forgot Password</Text>
          </TouchableOpacity>
        </Link> */}
        <TouchableOpacity style={styles.loginBtn}>
          <AppButton title="Log in" onPress={handleLogin} />

          <AppButton title="SIGN UP" href="signup" variant="secondary" />
        </TouchableOpacity>
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
  loginBtn: ViewStyle;
  linkText: TextStyle;
  inputWrapper: ViewStyle;
  inputField: TextStyle;
};

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    padding: 24,
    marginHorizontal: 32,
    marginVertical: 16,
    backgroundColor: "#fff",
  },
  loginBtn: { marginHorizontal: 32, marginTop: 12 },

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
  greeting: {
    paddingHorizontal: 20,
    fontSize: 24,
    color: "#666",
    marginBottom: 4,
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
    padding: 16,
  },
  input: {
    height: 44,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 18,
    fontSize: 16,
  },
  linkText: {
    color: "#003459",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    height: 44,
    fontSize: 16,
    padding: 12,
  },
});
