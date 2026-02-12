import { NavigatorScreenParams } from '@react-navigation/native';
import { Category } from '../types';
import { storeWallet } from '@/store/walletStore';

export type RootStackParamList = {
  Index: undefined;
  Onboarding: undefined;
  Auth: undefined;
  EmailVerificationPending: undefined;
  ProfileSetup: undefined;
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
  OTPVerification: {
    email: string;
    type: 'signup' | 'forgot_password';
    firstName?: string;
    lastName?: string;
    password?: string;
  };
  ForgotPassword: undefined;
  ChangePassword: undefined;
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
  WalletDetail: { data: storeWallet };
  WalletStatement: { walletId: string };
  Transfer: undefined;
  AppSettings: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  AddExpense: { transactionId?: string; date?: string } | undefined;
  Analytics: undefined;
  Transactions: undefined;
  Budget: undefined;
  Settings: undefined;
};
