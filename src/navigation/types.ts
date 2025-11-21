import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Index: undefined;
  Onboarding: undefined;
  Auth: undefined;
  MainTab: NavigatorScreenParams<MainTabParamList>;
  Profile: undefined;
  Notifications: undefined;
  Security: undefined;
  HelpSupport: undefined;
  NotFound: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  AddExpense: undefined;
  SmartSense: undefined;
  Analytics: undefined;
  Transactions: undefined;
  Budget: undefined;
  Wallets: undefined;
  Settings: undefined;
};
