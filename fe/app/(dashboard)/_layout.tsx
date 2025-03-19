import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

function CustomTabBarButton({ children, onPress, accessibilityState }: BottomTabBarButtonProps) {
  const isSelected = accessibilityState?.selected;

  return (
    <TouchableOpacity
      style={styles.tabButtonWrapper}
      onPress={onPress}
      activeOpacity={0.6} // softer press animation
    >
      <View style={[styles.iconWrapper, isSelected && styles.activeTab]}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 85,
          paddingBottom: 40,
          borderTopWidth: 0.5,
          borderTopColor: '#ccc',
        },
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
        // tabBarButton: (props: BottomTabBarButtonProps) => (
          // <TouchableOpacity
          //   {...props}
          //   style={styles.tabButton}
            // activeOpacity={0.7}
          // >
          //   {props.children}
          // </TouchableOpacity>
        // ),
      }}
    >
      <Tabs.Screen
        name="homepage"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={focused ? '#003459' : '#888'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={focused ? '#003459' : '#888'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'notifications' : 'notifications-outline'}
              size={24}
              color={focused ? '#003459' : '#888'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={focused ? '#003459' : '#888'}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: 'rgba(0, 52, 89, 0.1)', // soft highlight background for active tab
  },
});
