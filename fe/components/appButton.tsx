import React from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';

type ButtonVariant = 'primary' | 'secondary' | 'starter';

interface AppButtonProps {
  title: string;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  onPress?: (event: GestureResponderEvent) => void;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  href,
  disabled = false,
  loading = false,
  variant = 'primary',
  onPress,
}) => {
  const router = useRouter();

  const handlePress = (event: GestureResponderEvent) => {
    if (onPress) {
      onPress(event);
    } else if (href) {
      router.push(href);
    }
  };

  const buttonStyle = [
    styles.button,
    variant === 'secondary'
      ? styles.secondaryButton
      : variant === 'starter'
      ? styles.starterButton
      : styles.primaryButton,
    disabled && styles.disabled,
  ];

  const textStyle = [
    styles.buttonText,
    variant === 'secondary' && styles.secondaryText,
  ];

  return (
    <Pressable
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'secondary'
              ? Colors.primary
              : Colors.accent
          }
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create<{
  button: ViewStyle;
  primaryButton: ViewStyle;
  secondaryButton: ViewStyle;
  starterButton: ViewStyle;
  buttonText: TextStyle;
  secondaryText: TextStyle;
  disabled: ViewStyle;
}>({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    minWidth: 140,
    marginBottom: 10,
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
    width: '100%',
    flexShrink: 1
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderColor: Colors.primary,
    width: '100%'
  },
  starterButton: {
    paddingVertical: 14,
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryText: {
    color: Colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
});
