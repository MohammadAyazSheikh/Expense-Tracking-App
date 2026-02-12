import React from "react";
import { useAuthStore } from "@/store";
import { translate as t } from "@/i18n";
import { lightTheme } from "@/styles/theme";
import { Header } from "@/components/ui/Headers";
import { useUnistyles } from "react-native-unistyles";
import { Text } from "@/components/ui/Text";
import { TabNavigator } from "./TabNavigator";
import { RootStackParamList } from "./types";
import { createStackNavigator } from "@react-navigation/stack";
import { IndexScreen } from "@/screens/IndexScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { AuthScreen } from "@/screens/AuthScreen";
import { NotFoundScreen } from "@/screens/Placeholders";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { WalletsScreen } from "@/screens/WalletsScreen";
import { SecurityScreen } from "@/screens/SecurityScreen";
import { HelpSupportScreen } from "@/screens/HelpSupportScreen";
import { SmartSenseScreen } from "@/screens/SmartSenseScreen";
import { CategoryManagerScreen } from "@/screens/CategoryManagerScreen";
import { TransactionDetailScreen } from "@/screens/TransactionDetailScreen";
import { CalendarScreen } from "@/screens/CalendarScreen";
import { TagsScreen } from "@/screens/TagsScreen";
import { AddExpenseScreen } from "@/screens/AddExpenseScreen";
import { ForgotPasswordScreen } from "@/screens/auth/ForgotPasswordScreen";
import { ChangePasswordScreen } from "@/screens/auth/ResetPasswordScreen";
import { EmailVerificationPendingScreen } from "@/screens/auth/EmailVerificationPendingScreen";
import { ProfileSetupScreen } from "@/screens/ProfileSetupScreen";
import { CreateBudgetScreen } from "@/screens/CreateBudgetScreen";
import { GroupsScreen } from "@/screens/GroupsScreen";
import { CreateGroupScreen } from "@/screens/CreateGroupScreen";
import { GroupDetailScreen } from "@/screens/GroupDetailScreen";
import { AddGroupExpenseScreen } from "@/screens/AddGroupExpenseScreen";
import { SettleUpScreen } from "@/screens/SettleUpScreen";
import { FriendsScreen } from "@/screens/FriendsScreen";
import { FriendDetailScreen } from "@/screens/FriendDetailScreen";
import { BudgetScreen } from "@/screens/BudgetScreen";
import WalletDetailScreen from "@/screens/WalletDetailScreen";
import WalletStatementScreen from "@/screens/WalletStatementScreen";
import { AddWalletScreen } from "@/screens/AddWalletScreen";
import { EditWalletScreen } from "@/screens/EditWalletScreen";
import { TransferScreen } from "@/screens/TransferScreen";
import { NotificationsScreen } from "@/screens/NotificationsScreen";
import { NotificationSettingsScreen } from "@/screens/NotificationSettingsScreen";
import { AppSettingsScreen } from "@/screens/AppSettingsScreen";

const Stack = createStackNavigator<RootStackParamList>();

const authRoutes = () => {
  return (
    <Stack.Navigator
      initialRouteName="Index"
      screenOptions={{
        headerShown: false,
        header: ({ route, navigation, options }) => (
          <Header
            title={options.title || route.name}
            applySafeAreaPadding
            onBack={navigation.goBack}
          />
        ),
      }}
    >
      <Stack.Screen name="Index" component={IndexScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerShown: true,
          title: "Forgot Password",
        }}
      />
    </Stack.Navigator>
  );
};

const verificationPendingRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="EmailVerificationPending"
        component={EmailVerificationPendingScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

const resetPasswordRoutes = () => {
  return (
    <Stack.Navigator
      initialRouteName="ChangePassword"
      screenOptions={{
        headerShown: false,
        header: ({ route, navigation, options }) => (
          <Header
            title={options.title || route.name}
            applySafeAreaPadding
            onBack={navigation.goBack}
          />
        ),
      }}
    >
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          gestureEnabled: false,
          headerShown: true,
          title: "Change Password",
        }}
      />
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
};

const profileSetupRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

const mainRoutes = ({ theme }: { theme: typeof lightTheme }) => {
  return (
    <Stack.Navigator
      initialRouteName="MainTab"
      screenOptions={{
        headerShown: false,
        header: ({ route, navigation, options }) => (
          <Header
            title={options.title || route.name}
            applySafeAreaPadding
            onBack={navigation.goBack}
          />
        ),
      }}
    >
      <Stack.Screen name="MainTab" component={TabNavigator} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
      <Stack.Screen name="SmartSense" component={SmartSenseScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="EditExpense" component={AddExpenseScreen} />
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
      <Stack.Screen name="WalletDetail" component={WalletDetailScreen} />
      <Stack.Screen name="WalletStatement" component={WalletStatementScreen} />
      <Stack.Screen name="Transfer" component={TransferScreen} />
      <Stack.Screen
        name="AddWallet"
        component={AddWalletScreen}
        options={{ headerShown: true, title: t("wallets.addWallet") }}
      />
      <Stack.Screen
        name="EditWallet"
        component={EditWalletScreen}
        options={{ headerShown: true, title: t("wallets.editWallet") }}
      />
      <Stack.Screen
        name="AppSettings"
        component={AppSettingsScreen}
        options={{ headerShown: true, title: t("settings.appSettings") }}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
      />
      <Stack.Screen
        name="CategoryManager"
        options={{ headerShown: true, title: t("categoryManager.title") }}
        component={CategoryManagerScreen}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
      />
      <Stack.Screen
        name="TagManager"
        component={TagsScreen}
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <Header
              applySafeAreaPadding
              onBack={() => navigation.goBack()}
              title={t("tags.title", "Tags")}
            >
              <Text
                style={{
                  color: theme.colors.muted,
                  marginTop: theme.margins.md,
                }}
              >
                {t(
                  "tags.description",
                  "Create tags to organize your transactions",
                )}
              </Text>
            </Header>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  const { verificationStatus, user } = useAuthStore();
  const { theme } = useUnistyles();
  // Routing logic
  if (verificationStatus === "SINGED_OUT") {
    // No session → Auth screens
    return authRoutes();
  }

  if (verificationStatus === "RESET_PASSWORD") {
    //Logedin with reset password→ Reset password screen
    return resetPasswordRoutes();
  }

  if (verificationStatus === "VERIFICATION_PENDING") {
    // Session but email not VERIFIED → Email verification screen
    return verificationPendingRoutes();
  }

  if (verificationStatus === "VERIFIED" && !user?.firstName) {
    // Session + VERIFIED but no profile → Profile setup
    return profileSetupRoutes();
  }

  // Session + VERIFIED + profile complete → Main app
  if (verificationStatus === "VERIFIED" && user?.firstName) {
    return mainRoutes({ theme: theme as any });
  }

  return authRoutes();
};
