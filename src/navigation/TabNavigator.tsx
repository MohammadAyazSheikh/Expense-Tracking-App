import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { useUnistyles } from 'react-native-unistyles';
import { Feather } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AddExpenseScreen } from '../screens/AddExpenseScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';


const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator = () => {
  const { theme } = useUnistyles();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedForeground,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="list" size={size} color={color} />
        }}
      />
      <Tab.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="plus-circle" size={size} color={color} />,
          tabBarLabel: 'Add'
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} />
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />
        }}
      />
    </Tab.Navigator>
  );
};
