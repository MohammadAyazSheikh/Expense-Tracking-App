import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { IndexScreen } from '../screens/IndexScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { NotFoundScreen } from '../screens/Placeholders';
import { ProfileScreen } from '../screens/ProfileScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { WalletsScreen } from '../screens/WalletsScreen';
import { SecurityScreen } from '../screens/SecurityScreen';
import { HelpSupportScreen } from '../screens/HelpSupportScreen';
import { SmartSenseScreen } from '../screens/SmartSenseScreen';
import { useAuthStore } from '../store';

const Stack = createStackNavigator<RootStackParamList>();

const authRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Index" component={IndexScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  )
}

const mainRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTab" component={TabNavigator} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
      <Stack.Screen name="Wallets" component={WalletsScreen} />
      <Stack.Screen name="SmartSense" component={SmartSenseScreen} />
    </Stack.Navigator>
  )
}

export const RootNavigator = () => {
  const { isAuthenticated } = useAuthStore();
  return (
    isAuthenticated ? mainRoutes() : authRoutes()
  );
};
