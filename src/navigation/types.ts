import { NavigatorScreenParams } from '@react-navigation/native';
import { Category } from '../types';

export type RootStackParamList = {
  Index: undefined;
  Onboarding: undefined;
  Auth: undefined;
  MainTab: NavigatorScreenParams<MainTabParamList>;
  Profile: undefined;
  Notifications: undefined;
  NotificationSettings: undefined;
  Security: undefined;
  HelpSupport: undefined;
  NotFound: undefined;
  SmartSense: undefined;
  CategoryManager: undefined;
  Calendar: undefined;
  TagManager: undefined;
  TransactionDetail: { id: string, category: Category };
  EditExpense: { transactionId?: string; date?: string } | undefined;
  OTPVerification: { email: string; type: 'signup' | 'forgot_password' };
  ForgotPassword: undefined;
  ResetPassword: { email: string; code: string };
  Budget: undefined;
  CreateBudget: undefined;
  Groups: undefined;
  CreateGroup: undefined;
  GroupDetail: { id: string };
  AddGroupExpense: { groupId: string };
  SettleUp: { groupId?: string; friendId?: string };
  Friends: undefined;
  FriendDetail: { friendId: string };
  Wallets: undefined;
  AddWallet: undefined;
  EditWallet: { walletId: string };
  WalletDetail: { walletId: string };
  WalletStatement: { walletId: string };
  Transfer: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  AddExpense: { transactionId?: string; date?: string } | undefined;
  Analytics: undefined;
  Transactions: undefined;
  Budget: undefined;
  Settings: undefined;
};
