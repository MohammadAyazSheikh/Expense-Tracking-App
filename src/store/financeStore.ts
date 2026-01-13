import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../utils/storage';
import { Transaction, Budget, Wallet, Category, Tag, Group, GroupExpense, Settlement, Friend } from '../types';

interface FinanceState {
  // State
  transactions: Transaction[];
  budgets: Budget[];
  wallets: Wallet[];
  categories: Category[];
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  groups: Group[];
  friends: Friend[];
  groupExpenses: GroupExpense[];
  settlements: Settlement[];

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

  // Split Bill Actions
  addGroup: (group: Omit<Group, 'id'>) => void;
  updateGroup: (id: string, group: Partial<Group>) => void;
  deleteGroup: (id: string) => void;

  addFriend: (friend: Omit<Friend, 'id'>) => void;
  updateFriend: (id: string, friend: Partial<Friend>) => void;
  deleteFriend: (id: string) => void;

  addGroupExpense: (expense: Omit<GroupExpense, 'id'>) => void;
  addSettlement: (settlement: Omit<Settlement, 'id'>) => void;
  updateSettlement: (id: string, settlement: Partial<Settlement>) => void;
}

// Mock Data
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', name: "Starbucks Coffee", category: "Food", amount: -4.50, date: "2024-06-15", time: "10:30 AM", type: "expense", payment: "Card" },
  { id: '2', name: "Salary Deposit", category: "Salary", amount: 3500, date: "2024-06-15", time: "09:00 AM", type: "income", payment: "Bank" },
  { id: '3', name: "Uber Ride", category: "Transport", amount: -12.30, date: "2024-06-14", time: "18:45 PM", type: "expense", payment: "Card" },
  { id: '4', name: "Netflix Subscription", category: "Bills", amount: -15.99, date: "2024-06-14", time: "12:00 PM", type: "expense", payment: "Card" },
  { id: '5', name: "Grocery Shopping", category: "Food", amount: -85.20, date: "2024-06-13", time: "14:20 PM", type: "expense", payment: "Cash" },
  { id: '6', name: "Freelance Project", category: "Salary", amount: 850, date: "2024-06-12", time: "16:30 PM", type: "income", payment: "Bank" },
  { id: '7', name: "Gym Membership", category: "Health", amount: -45, date: "2024-06-11", time: "07:00 AM", type: "expense", payment: "Card" },
  { id: '8', name: "Amazon Purchase", category: "Shopping", amount: -32.99, date: "2024-06-10", time: "20:15 PM", type: "expense", payment: "Card" },

  { id: '9', name: "Morning Coffee", category: "Food", amount: -5.75, date: "2025-12-20", time: "08:15 AM", type: "expense", payment: "Card" },
  { id: '10', name: "Gas Station", category: "Transport", amount: -52.00, date: "2025-12-20", time: "08:45 AM", type: "expense", payment: "Card" },
  { id: '11', name: "Client Payment", category: "Salary", amount: 1200, date: "2025-12-20", time: "09:30 AM", type: "income", payment: "Bank" },

  { id: '12', name: "Lunch at Restaurant", category: "Food", amount: -28.50, date: "2025-12-20", time: "12:30 PM", type: "expense", payment: "Card" },
  { id: '13', name: "Pharmacy", category: "Health", amount: -18.99, date: "2025-12-20", time: "13:45 PM", type: "expense", payment: "Card" },
  { id: '14', name: "Online Course", category: "Education", amount: -79.99, date: "2025-12-20", time: "14:00 PM", type: "expense", payment: "Card" },
  { id: '15', name: "Electricity Bill", category: "Bills", amount: -125.50, date: "2025-12-20", time: "15:20 PM", type: "expense", payment: "Bank" },
  { id: '16', name: "Coffee Shop", category: "Food", amount: -6.25, date: "2025-12-20", time: "16:00 PM", type: "expense", payment: "Cash" },
  { id: '17', name: "Book Store", category: "Shopping", amount: -34.99, date: "2025-12-20", time: "17:30 PM", type: "expense", payment: "Card" },
  { id: '18', name: "Uber Eats", category: "Food", amount: -23.45, date: "2025-12-20", time: "19:15 PM", type: "expense", payment: "Card" },
  { id: '19', name: "Spotify Premium", category: "Bills", amount: -10.99, date: "2025-12-20", time: "20:00 PM", type: "expense", payment: "Card" },
  { id: '20', name: "Movie Tickets", category: "Entertainment", amount: -28.00, date: "2025-12-20", time: "20:45 PM", type: "expense", payment: "Card" },
  { id: '21', name: "Parking Fee", category: "Transport", amount: -8.00, date: "2025-12-20", time: "21:00 PM", type: "expense", payment: "Cash" },
  { id: '22', name: "Internet Bill", category: "Bills", amount: -65.00, date: "2025-12-20", time: "10:00 AM", type: "expense", payment: "Bank" },
  { id: '23', name: "Grocery Store", category: "Food", amount: -92.35, date: "2025-12-20", time: "11:30 AM", type: "expense", payment: "Card" },
  { id: '24', name: "Car Wash", category: "Transport", amount: -15.00, date: "2025-12-20", time: "09:00 AM", type: "expense", payment: "Cash" },
  { id: '25', name: "Investment Dividend", category: "Investment", amount: 250, date: "2025-12-20", time: "10:15 AM", type: "income", payment: "Bank" },
  { id: '26', name: "Clothing Store", category: "Shopping", amount: -68.75, date: "2025-12-20", time: "15:45 PM", type: "expense", payment: "Card" },
  { id: '27', name: "Hair Salon", category: "Health", amount: -45.00, date: "2025-12-20", time: "14:30 PM", type: "expense", payment: "Card" },
  { id: '28', name: "Gift Purchase", category: "Shopping", amount: -55.99, date: "2025-12-20", time: "18:00 PM", type: "expense", payment: "Card" },

];

const MOCK_GROUPS: Group[] = [
  {
    id: "1",
    name: "Apartment Roommates",
    members: ["You", "Sarah", "Mike"],
    totalExpenses: 1250.0,
    youOwe: 45.5,
    youAreOwed: 0,
    lastActivity: "2 hours ago",
    avatar: "🏠",
  },
  {
    id: "2",
    name: "Trip to Bali",
    members: ["You", "Emma", "John", "Lisa"],
    totalExpenses: 3420.0,
    youOwe: 0,
    youAreOwed: 125.0,
    lastActivity: "Yesterday",
    avatar: "✈️",
  },
];

const MOCK_FRIENDS: Friend[] = [
  { id: "1", name: "Sarah", avatar: "👩‍🦰" },
  { id: "2", name: "Mike", avatar: "👨" },
  { id: "3", name: "Emma", avatar: "👩" },
  { id: "4", name: "John", avatar: "🧔" },
];

const MOCK_GROUP_EXPENSES: GroupExpense[] = [
  { id: '1', groupId: "1", paidBy: "You", amount: 1250.0, description: "Grocery Store", date: "2025-12-20", splitType: "equal", splits: [{ memberId: "1", amount: 1250.0 }] },
  { id: '2', groupId: "2", paidBy: "You", amount: 3420.0, description: "Car Wash", date: "2025-12-20", splitType: "equal", splits: [{ memberId: "2", amount: 3420.0 }] },
  { id: '3', groupId: "1", paidBy: "You", amount: 250.0, description: "Investment Dividend", date: "2025-12-20", splitType: "equal", splits: [{ memberId: "1", amount: 250.0 }] },
];
const MOCK_WALLETS: Wallet[] = [
  { id: '1', name: "Main Wallet", balance: 2450.50, type: "Cash", color: "#6C63FF", icon: "briefcase" },
  { id: '2', name: "Savings", balance: 12000.00, type: "Bank", color: "#4CAF50", last4: "4521", icon: "home" },
  { id: '3', name: "Credit Card", balance: -450.25, type: "Card", color: "#FF5252", last4: "8892", icon: "credit-card" },
];

const MOCK_BUDGETS: Budget[] = [
  { id: '1', category: "Food", limit: 500, spent: 350, period: "monthly", color: "#FF9800", },
  { id: '2', category: "Transport", limit: 200, spent: 120, period: "monthly", color: "#2196F3", },
  { id: '3', category: "Shopping", limit: 300, spent: 280, period: "monthly", color: "#E91E63" },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', icon: 'food', iconFamily: 'MaterialCommunityIcons', color: '#FF6B6B', type: 'expense' },
  { id: '2', name: 'Transport', icon: 'directions-transit', iconFamily: 'MaterialIcons', color: '#4ECDC4', type: 'expense' },
  { id: '3', name: 'Shopping', icon: 'shop', iconFamily: 'Entypo', color: '#45B7D1', type: 'expense' },
  { id: '4', name: 'Bills', icon: 'file-document-outline', iconFamily: 'MaterialCommunityIcons', color: '#96CEB4', type: 'expense' },
  { id: '5', name: 'Entertainment', icon: 'movie', iconFamily: 'MaterialIcons', color: '#FFEEAD', type: 'expense' },
  { id: '6', name: 'Health', icon: 'heartbeat', iconFamily: 'FontAwesome5', color: '#D4A5A5', type: 'expense' },
  { id: '7', name: 'Education', icon: 'school', iconFamily: 'Ionicons', color: '#9B59B6', type: 'expense' },
  { id: '8', name: 'Salary', icon: 'attach-money', iconFamily: 'MaterialIcons', color: '#2ECC71', type: 'income' },
  { id: '9', name: 'Bonus', icon: 'card-giftcard', iconFamily: 'MaterialIcons', color: '#F1C40F', type: 'income' },
  { id: '10', name: 'Investment', icon: 'trending-up', iconFamily: 'MaterialIcons', color: '#3498DB', type: 'income' },
  { id: '11', name: 'Gift', icon: 'gift', iconFamily: 'FontAwesome', color: '#E74C3C', type: 'income' },
  { id: '12', name: 'Other Income', icon: 'plus-circle', iconFamily: 'MaterialCommunityIcons', color: '#95A5A6', type: 'income' },
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
      groups: MOCK_GROUPS,
      friends: MOCK_FRIENDS,
      groupExpenses: MOCK_GROUP_EXPENSES,
      settlements: [],
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

      addGroup: (group) => {
        const newGroup = { ...group, id: Math.random().toString(36).substr(2, 9) };
        set((state) => ({
          groups: [...state.groups, newGroup],
        }));
      },

      updateGroup: (id, updatedGroup) => {
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, ...updatedGroup } : g
          ),
        }));
      },

      deleteGroup: (id) => {
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
        }));
      },

      addFriend: (friend) => {
        const newFriend = { ...friend, id: Math.random().toString(36).substr(2, 9) };
        set((state) => ({
          friends: [...state.friends, newFriend],
        }));
      },

      updateFriend: (id, updatedFriend) => {
        set((state) => ({
          friends: state.friends.map((f) =>
            f.id === id ? { ...f, ...updatedFriend } : f
          ),
        }));
      },

      deleteFriend: (id) => {
        set((state) => ({
          friends: state.friends.filter((f) => f.id !== id),
        }));
      },

      addGroupExpense: (expense) => {
        const newExpense = { ...expense, id: Math.random().toString(36).substr(2, 9) };
        set((state) => ({
          groupExpenses: [...state.groupExpenses, newExpense],
        }));
      },

      addSettlement: (settlement) => {
        const newSettlement = { ...settlement, id: Math.random().toString(36).substr(2, 9) };
        set((state) => ({
          settlements: [...state.settlements, newSettlement],
        }));
      },

      updateSettlement: (id, updatedSettlement) => {
        set((state) => ({
          settlements: state.settlements.map((s) =>
            s.id === id ? { ...s, ...updatedSettlement } : s
          ),
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
        groups: state.groups,
        friends: state.friends,
        groupExpenses: state.groupExpenses,
        settlements: state.settlements,
      }),
    }
  )
);
