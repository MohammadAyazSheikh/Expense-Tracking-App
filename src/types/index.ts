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
  icon?: string;
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
  iconFamily?: string;
  color: string;
  type: 'income' | 'expense';
  tags?: string[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}
