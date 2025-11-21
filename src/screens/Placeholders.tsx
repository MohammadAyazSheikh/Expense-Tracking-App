import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

const PlaceholderScreen = ({ name }: { name: string }) => {
  const { theme } = useUnistyles();
  
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    text: {
      color: theme.colors.foreground,
      fontSize: theme.fontSize.lg,
    }
  }), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name} Screen</Text>
    </View>
  );
};

export const IndexScreen = () => <PlaceholderScreen name="Index" />;
export const OnboardingScreen = () => <PlaceholderScreen name="Onboarding" />;
export const AuthScreen = () => <PlaceholderScreen name="Auth" />;
export const DashboardScreen = () => <PlaceholderScreen name="Dashboard" />;
export const AddExpenseScreen = () => <PlaceholderScreen name="AddExpense" />;
export const SmartSenseScreen = () => <PlaceholderScreen name="SmartSense" />;
export const AnalyticsScreen = () => <PlaceholderScreen name="Analytics" />;
export const TransactionsScreen = () => <PlaceholderScreen name="Transactions" />;
export const BudgetScreen = () => <PlaceholderScreen name="Budget" />;
export const WalletsScreen = () => <PlaceholderScreen name="Wallets" />;
export const SettingsScreen = () => <PlaceholderScreen name="Settings" />;
export const ProfileScreen = () => <PlaceholderScreen name="Profile" />;
export const NotificationsScreen = () => <PlaceholderScreen name="Notifications" />;
export const SecurityScreen = () => <PlaceholderScreen name="Security" />;
export const HelpSupportScreen = () => <PlaceholderScreen name="HelpSupport" />;
export const NotFoundScreen = () => <PlaceholderScreen name="NotFound" />;
