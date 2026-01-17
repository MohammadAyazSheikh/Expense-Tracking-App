import { IconType } from "../components/ui/Icon";

export interface Transaction {
  id: string;
  name: string;
  description?: string;
  category: string;
  amount: number;
  date: string;
  time: string;
  type: 'income' | 'expense' | 'transfer';
  payment: string;
  note?: string;
  tags?: string[];
  location?: string;
  recurring?: boolean;
  walletId?: string;
  toWalletId?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  color: string;
}

export interface Group {
  id: string;
  name: string;
  members: string[];
  totalExpenses: number;
  youOwe: number;
  youAreOwed: number;
  lastActivity: string;
  avatar: string;
}

export interface GroupExpense {
  id: string;
  groupId: string;
  paidBy: string;
  amount: number;
  description: string;
  date: string;
  splitType: 'equal' | 'exact' | 'percentage';
  splits: { memberId: string; amount: number }[];
}

export interface Settlement {
  id: string;
  groupId: string;
  from: string;
  to: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed';
}

export interface Friend {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  type: string;
  color: string;
  textColor?: string;
  accountNumber?: string;
  last4?: string;
  icon?: string;
  currency?: string;
  includeInTotal?: boolean;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  iconFamily?: IconType;
  color: string;
  type: 'income' | 'expense';
  tags?: string[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export type NotificationActionType =
  | "accept_decline"
  | "pay"
  | "view"
  | "review_security"
  | "add_funds"
  | "view_insight"
  | "view_report"
  | "invite_friend"
  | "explore"
  | null;

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  iconName?: string; // Changed from icon: any to iconName: string for RN compatibility
  color: string;
  bgColor: string;
  read: boolean;
  action: string;
  actionButtons?: NotificationActionType;
  actionData?: {
    primaryLabel?: string;
    secondaryLabel?: string;
    amount?: string;
  };
}
