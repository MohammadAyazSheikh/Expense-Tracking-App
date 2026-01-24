import { Category } from "../types";

export const DEFAULT_CATEGORIES: Category[] = [
    { id: '1', name: 'Food', icon: 'food', iconFamily: 'MaterialCommunityIcons', color: '#FF6B6B', type: 'expense', isSystem: true },
    { id: '2', name: 'Transport', icon: 'directions-transit', iconFamily: 'MaterialIcons', color: '#4ECDC4', type: 'expense', isSystem: true },
    { id: '3', name: 'Shopping', icon: 'shop', iconFamily: 'Entypo', color: '#45B7D1', type: 'expense', isSystem: true },
    { id: '4', name: 'Bills', icon: 'file-document-outline', iconFamily: 'MaterialCommunityIcons', color: '#96CEB4', type: 'expense', isSystem: true },
    { id: '5', name: 'Entertainment', icon: 'movie', iconFamily: 'MaterialIcons', color: '#FFEEAD', type: 'expense', isSystem: true },
    { id: '6', name: 'Health', icon: 'heartbeat', iconFamily: 'FontAwesome5', color: '#D4A5A5', type: 'expense', isSystem: true },
    { id: '7', name: 'Education', icon: 'school', iconFamily: 'Ionicons', color: '#9B59B6', type: 'expense', isSystem: true },
    { id: '8', name: 'Salary', icon: 'attach-money', iconFamily: 'MaterialIcons', color: '#2ECC71', type: 'income', isSystem: true },
    { id: '9', name: 'Bonus', icon: 'card-giftcard', iconFamily: 'MaterialIcons', color: '#F1C40F', type: 'income', isSystem: true },
    { id: '10', name: 'Investment', icon: 'trending-up', iconFamily: 'MaterialIcons', color: '#3498DB', type: 'income', isSystem: true },
    { id: '11', name: 'Gift', icon: 'gift', iconFamily: 'FontAwesome', color: '#E74C3C', type: 'income', isSystem: true },
    { id: '12', name: 'Other Income', icon: 'plus-circle', iconFamily: 'MaterialCommunityIcons', color: '#95A5A6', type: 'income', isSystem: true },
];
