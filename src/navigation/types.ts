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
  EditExpense: { transactionId?: string; date?: string } | undefined;
  OTPVerification: { email: string; type: 'signup' | 'forgot_password' };
  ForgotPassword: undefined;
  ResetPassword: { email: string; code: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  AddExpense: { transactionId?: string; date?: string } | undefined;
  Analytics: undefined;
  Transactions: undefined;
  Budget: undefined;
  Settings: undefined;
};
