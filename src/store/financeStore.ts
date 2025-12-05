import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../utils/storage';
import { Transaction, Budget, Wallet, Category, Tag } from '../types';

interface FinanceState {
  // State
  transactions: Transaction[];
  budgets: Budget[];
  wallets: Wallet[];
  categories: Category[];
  tags: Tag[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;

  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  addWallet: (wallet: Omit<Wallet, 'id'>) => void;
  updateWallet: (id: string, wallet: Partial<Wallet>) => void;
  deleteWallet: (id: string) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (id: string, tag: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
}

// Mock Data
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', name: "Starbucks Coffee", category: "Food", amount: -4.50, date: "2024-06-15", time: "10:30 AM", type: "expense", payment: "Card" },
  { id: '2', name: "Salary Deposit", category: "Income", amount: 3500, date: "2024-06-15", time: "09:00 AM", type: "income", payment: "Bank" },
  { id: '3', name: "Uber Ride", category: "Transport", amount: -12.30, date: "2024-06-14", time: "18:45 PM", type: "expense", payment: "Card" },
  { id: '4', name: "Netflix Subscription", category: "Bills", amount: -15.99, date: "2024-06-14", time: "12:00 PM", type: "expense", payment: "Card" },
  { id: '5', name: "Grocery Shopping", category: "Food", amount: -85.20, date: "2024-06-13", time: "14:20 PM", type: "expense", payment: "Cash" },
  { id: '6', name: "Freelance Project", category: "Income", amount: 850, date: "2024-06-12", time: "16:30 PM", type: "income", payment: "Bank" },
  { id: '7', name: "Gym Membership", category: "Health", amount: -45, date: "2024-06-11", time: "07:00 AM", type: "expense", payment: "Card" },
  { id: '8', name: "Amazon Purchase", category: "Shopping", amount: -32.99, date: "2024-06-10", time: "20:15 PM", type: "expense", payment: "Card" },
];

const MOCK_WALLETS: Wallet[] = [
  { id: '1', name: "Main Wallet", balance: 2450.50, type: "Cash", color: "#6C63FF", icon: "briefcase" },
  { id: '2', name: "Savings", balance: 12000.00, type: "Bank", color: "#4CAF50", last4: "4521", icon: "home" },
  { id: '3', name: "Credit Card", balance: -450.25, type: "Card", color: "#FF5252", last4: "8892", icon: "credit-card" },
];

const MOCK_BUDGETS: Budget[] = [
  { id: '1', category: "Food", limit: 500, spent: 350, period: "monthly", color: "#FF9800", icon: "🍔" },
  { id: '2', category: "Transport", limit: 200, spent: 120, period: "monthly", color: "#2196F3", icon: "🚗" },
  { id: '3', category: "Shopping", limit: 300, spent: 280, period: "monthly", color: "#E91E63", icon: "🛍️" },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', icon: 'food', iconFamily: 'MaterialCommunityIcons', color: '#FF6B6B', type: 'expense' },
  { id: '2', name: 'Transport', icon: 'directions-transit', iconFamily: 'MaterialIcons', color: '#4ECDC4', type: 'expense' },
  { id: '3', name: 'Shopping', icon: 'shop', iconFamily: 'Entypo', color: '#45B7D1', type: 'expense' },
  { id: '4', name: 'Bills', icon: 'file-document-outline', iconFamily: 'MaterialCommunityIcons', color: '#96CEB4', type: 'expense' },
  { id: '5', name: 'Entertainment', icon: 'movie', iconFamily: 'MaterialIcons', color: '#FFEEAD', type: 'expense' },
  { id: '6', name: 'Health', icon: 'heartbeat', iconFamily: 'FontAwesome5', color: '#D4A5A5', type: 'expense' },
  { id: '7', name: 'Education', icon: 'school', iconFamily: 'Ionicons', color: '#9B59B6', type: 'expense' },
  { id: '8', name: 'Income', icon: 'attach-money', iconFamily: 'MaterialIcons', color: '#2ECC71', type: 'income' },
];

const DEFAULT_TAGS: Tag[] = [
  { id: 'work', name: 'Work', color: 'hsl(210, 80%, 55%)' },
  { id: 'personal', name: 'Personal', color: 'hsl(280, 70%, 60%)' },
  { id: 'urgent', name: 'Urgent', color: 'hsl(0, 75%, 60%)' },
  { id: 'recurring', name: 'Recurring', color: 'hsl(145, 70%, 50%)' },
  { id: 'one-time', name: 'One-time', color: 'hsl(35, 85%, 55%)' },
  { id: 'business', name: 'Business', color: 'hsl(220, 70%, 55%)' },
  { id: 'family', name: 'Family', color: 'hsl(340, 70%, 60%)' },
  { id: 'essential', name: 'Essential', color: 'hsl(160, 70%, 50%)' },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      // Initial state
      transactions: MOCK_TRANSACTIONS,
      budgets: MOCK_BUDGETS,
      wallets: MOCK_WALLETS,
      categories: DEFAULT_CATEGORIES,
      tags: DEFAULT_TAGS,
      isLoading: false,
      error: null,

      // Actions
      addTransaction: (transaction) => {
        const newTransaction = { ...transaction, id: Math.random().toString(36).substr(2, 9) };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      updateTransaction: (id, updatedTransaction) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updatedTransaction } : t
          ),
        }));
      },

      addBudget: (budget) => {
        const newBudget = { ...budget, id: Math.random().toString(36).substr(2, 9) };
        set((state) => ({
          budgets: [...state.budgets, newBudget],
        }));
      },

      updateBudget: (id, updatedBudget) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...updatedBudget } : b
          ),
        }));
      },

      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        }));
      },

      addWallet: (wallet) => {
        const newWallet = { ...wallet, id: Math.random().toString(36).substr(2, 9) };
        set((state) => ({
          wallets: [...state.wallets, newWallet],
        }));
      },

      updateWallet: (id, updatedWallet) => {
        set((state) => ({
          wallets: state.wallets.map((w) =>
            w.id === id ? { ...w, ...updatedWallet } : w
          ),
        }));
      },

      deleteWallet: (id) => {
        set((state) => ({
          wallets: state.wallets.filter((w) => w.id !== id),
        }));
      },

      addCategory: (category) => {
        const newCategory = { ...category, id: Math.random().toString(36).substr(2, 9) };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (id, updatedCategory) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updatedCategory } : c
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      addTag: (tag) => {
        const newTag = { ...tag, id: Math.random().toString(36).substr(2, 9) };
        set((state) => ({
          tags: [...state.tags, newTag],
        }));
      },

      updateTag: (id, updatedTag) => {
        set((state) => ({
          tags: state.tags.map((t) =>
            t.id === id ? { ...t, ...updatedTag } : t
          ),
        }));
      },

      deleteTag: (id) => {
        set((state) => ({
          tags: state.tags.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: 'finance-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        budgets: state.budgets,
        wallets: state.wallets,
        categories: state.categories,
        tags: state.tags,
      }),
    }
  )
);
