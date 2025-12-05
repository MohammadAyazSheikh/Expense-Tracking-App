import { NavigatorScreenParams } from '@react-navigation/native';
import { Category } from '../types';

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
  Wallets: undefined;
  SmartSense: undefined;
  CategoryManager: undefined;
  Calendar: undefined;
  TagManager: undefined;
  TransactionDetail: { id: string, category: Category };
};

export type MainTabParamList = {
  Dashboard: undefined;
  AddExpense: undefined;
  Analytics: undefined;
  Transactions: undefined;
  Budget: undefined;
  Settings: undefined;
};
