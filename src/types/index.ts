export interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  time: string;
  type: 'income' | 'expense';
  payment: string;
  note?: string;
  tags?: string[];
  location?: string;
  recurring?: boolean;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly';
  color: string;
  icon?: string;
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
