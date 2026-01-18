import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import { TabNavigator } from "./TabNavigator";
import { IndexScreen } from "../screens/IndexScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { AuthScreen } from "../screens/AuthScreen";
import { NotFoundScreen } from "../screens/Placeholders";
import { ProfileScreen } from "../screens/ProfileScreen";
import { WalletsScreen } from "../screens/WalletsScreen";
import { SecurityScreen } from "../screens/SecurityScreen";
import { HelpSupportScreen } from "../screens/HelpSupportScreen";
import { SmartSenseScreen } from "../screens/SmartSenseScreen";
import { CategoryManagerScreen } from "../screens/CategoryManagerScreen";
import { useAuthStore } from "../store";
import { TransactionDetailScreen } from "../screens/TransactionDetailScreen";
import { CalendarScreen } from "../screens/CalendarScreen";
import { TagsScreen } from "../screens/TagsScreen";
import { AddExpenseScreen } from "../screens/AddExpenseScreen";

import { OTPVerificationScreen } from "../screens/auth/OTPVerificationScreen";
import { ForgotPasswordScreen } from "../screens/auth/ForgotPasswordScreen";
import { ResetPasswordScreen } from "../screens/auth/ResetPasswordScreen";
import { CreateBudgetScreen } from "../screens/CreateBudgetScreen";
import { GroupsScreen } from "../screens/GroupsScreen";
import { CreateGroupScreen } from "../screens/CreateGroupScreen";
import { GroupDetailScreen } from "../screens/GroupDetailScreen";
import { AddGroupExpenseScreen } from "../screens/AddGroupExpenseScreen";
import { SettleUpScreen } from "../screens/SettleUpScreen";
import { FriendsScreen } from "../screens/FriendsScreen";
import { FriendDetailScreen } from "../screens/FriendDetailScreen";
import { BudgetScreen } from "../screens/BudgetScreen";
import WalletDetailScreen from "../screens/WalletDetailScreen";
import WalletStatementScreen from "../screens/WalletStatementScreen";
import { AddWalletScreen } from "../screens/AddWalletScreen";
import { EditWalletScreen } from "../screens/EditWalletScreen";
import { TransferScreen } from "../screens/TransferScreen";
import { NotificationsScreen } from "../screens/NotificationsScreen";
import { NotificationSettingsScreen } from "../screens/NotificationSettingsScreen";

const Stack = createStackNavigator<RootStackParamList>();

const authRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Index" component={IndexScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

const mainRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTab" component={TabNavigator} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
      />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
      <Stack.Screen name="SmartSense" component={SmartSenseScreen} />
      <Stack.Screen name="CategoryManager" component={CategoryManagerScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="TagManager" component={TagsScreen} />
      <Stack.Screen name="EditExpense" component={AddExpenseScreen} />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
      />
      <Stack.Screen name="Budget" component={BudgetScreen} />
      <Stack.Screen name="CreateBudget" component={CreateBudgetScreen} />
      <Stack.Screen name="Groups" component={GroupsScreen} />
      <Stack.Screen name="AddGroupExpense" component={AddGroupExpenseScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <Stack.Screen name="SettleUp" component={SettleUpScreen} />
      <Stack.Screen name="Friends" component={FriendsScreen} />
      <Stack.Screen name="FriendDetail" component={FriendDetailScreen} />
      <Stack.Screen name="Wallets" component={WalletsScreen} />
      <Stack.Screen name="AddWallet" component={AddWalletScreen} />
      <Stack.Screen name="EditWallet" component={EditWalletScreen} />
      <Stack.Screen name="WalletDetail" component={WalletDetailScreen} />
      <Stack.Screen name="WalletStatement" component={WalletStatementScreen} />
      <Stack.Screen name="Transfer" component={TransferScreen} />
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? mainRoutes() : authRoutes();
};
