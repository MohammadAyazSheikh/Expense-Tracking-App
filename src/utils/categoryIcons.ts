import { IconName, IconType } from '../components/ui/Icon';

// This type ensures that for a given 'type', the 'name' must be valid for that icon set.
export type CategoryIconConfig = {
    [K in IconType]: {
        type: K;
        name: IconName<K>;
    }
}[IconType];

export type CategoryGroup = {
    title: string;
    data: string[]; // List of keys in CATEGORY_ICONS
};

export const CATEGORY_ICONS: Record<string, CategoryIconConfig> = {
    // General & Income
    'Other': { type: 'MaterialIcons', name: 'category' },
    'General': { type: 'Ionicons', name: 'apps' },
    'Income': { type: 'MaterialIcons', name: 'attach-money' },
    'Salary': { type: 'MaterialCommunityIcons', name: 'briefcase-check' },
    'Freelance': { type: 'FontAwesome5', name: 'laptop-code' },
    'Investment': { type: 'Ionicons', name: 'trending-up' },
    'Bonus': { type: 'MaterialCommunityIcons', name: 'gift-outline' },
    'Dividends': { type: 'MaterialCommunityIcons', name: 'chart-line-variant' },
    'Rental Income': { type: 'MaterialCommunityIcons', name: 'home-import-outline' },
    'Refund': { type: 'MaterialCommunityIcons', name: 'cash-refund' },
    'Sale': { type: 'MaterialCommunityIcons', name: 'point-of-sale' },
    'Grants': { type: 'FontAwesome5', name: 'hand-holding-usd' },

    // Work & Office
    'Work': { type: 'MaterialIcons', name: 'work' },
    'Meeting': { type: 'MaterialIcons', name: 'meeting-room' },
    'Project': { type: 'Octicons', name: 'project' },
    'Client': { type: 'MaterialCommunityIcons', name: 'account-tie' },
    'Deadline': { type: 'MaterialCommunityIcons', name: 'calendar-clock' },
    'Coworking': { type: 'MaterialCommunityIcons', name: 'desk' },
    'Office': { type: 'MaterialCommunityIcons', name: 'desk' }, // Updated reference

    // Food & Drink
    'Food': { type: 'MaterialCommunityIcons', name: 'food' },
    'Restaurants': { type: 'Ionicons', name: 'restaurant' },
    'Coffee': { type: 'MaterialCommunityIcons', name: 'coffee' },
    'Groceries': { type: 'MaterialCommunityIcons', name: 'cart' },
    'Drinks': { type: 'Entypo', name: 'drink' },
    'Alcohol': { type: 'MaterialIcons', name: 'local-bar' },
    'Fast Food': { type: 'MaterialCommunityIcons', name: 'hamburger' },
    'Pizza': { type: 'MaterialCommunityIcons', name: 'pizza' },
    'Dessert': { type: 'MaterialCommunityIcons', name: 'cupcake' },
    'Bakery': { type: 'MaterialCommunityIcons', name: 'baguette' },
    'Vegetarian': { type: 'MaterialCommunityIcons', name: 'leaf' },
    'Sushi': { type: 'MaterialCommunityIcons', name: 'fish' },
    'Delivery': { type: 'MaterialCommunityIcons', name: 'moped' },
    'Snacks': { type: 'MaterialCommunityIcons', name: 'cookie' },

    // Household & Utilities
    'Bills': { type: 'MaterialCommunityIcons', name: 'file-document-outline' },
    'Rent': { type: 'MaterialCommunityIcons', name: 'home-city' },
    'Mortgage': { type: 'MaterialCommunityIcons', name: 'home-analytics' },
    'Electricity': { type: 'MaterialCommunityIcons', name: 'lightning-bolt' },
    'Water': { type: 'MaterialCommunityIcons', name: 'water' },
    'Gas': { type: 'MaterialCommunityIcons', name: 'gas-cylinder' },
    'Internet': { type: 'MaterialCommunityIcons', name: 'wifi' },
    'Phone': { type: 'MaterialIcons', name: 'smartphone' },
    'Cable TV': { type: 'MaterialIcons', name: 'tv' },
    'Maintenance': { type: 'MaterialIcons', name: 'build' },
    'Repairs': { type: 'MaterialCommunityIcons', name: 'hammer-wrench' },
    'Furniture': { type: 'MaterialCommunityIcons', name: 'sofa' },
    'Cleaning': { type: 'MaterialCommunityIcons', name: 'broom' },
    'Garden': { type: 'MaterialCommunityIcons', name: 'flower' },
    'Security': { type: 'MaterialCommunityIcons', name: 'shield-home' },
    'Kitchen': { type: 'MaterialCommunityIcons', name: 'pot-steam' },
    'Laundry': { type: 'MaterialCommunityIcons', name: 'washing-machine' },
    'Bedroom': { type: 'MaterialCommunityIcons', name: 'bed' },
    'Bathroom': { type: 'MaterialCommunityIcons', name: 'shower' },
    'Decor': { type: 'MaterialCommunityIcons', name: 'lamp' }, // Reusing lamp for general decor

    // Transportation
    'Transport': { type: 'MaterialIcons', name: 'directions-transit' },
    'Fuel': { type: 'MaterialCommunityIcons', name: 'gas-station' },
    'Taxi': { type: 'FontAwesome', name: 'taxi' },
    'Rideshare': { type: 'FontAwesome5', name: 'uber' },
    'Public Transport': { type: 'FontAwesome5', name: 'bus' },
    'Metro': { type: 'MaterialCommunityIcons', name: 'train' },
    'Train': { type: 'FontAwesome5', name: 'train' },
    'Flight': { type: 'MaterialIcons', name: 'flight' },
    'Car Maintenance': { type: 'MaterialCommunityIcons', name: 'car-wrench' },
    'Car Wash': { type: 'MaterialCommunityIcons', name: 'car-wash' },
    'Parking': { type: 'MaterialCommunityIcons', name: 'parking' },
    'Tolls': { type: 'MaterialCommunityIcons', name: 'highway' },
    'Bicycle': { type: 'MaterialCommunityIcons', name: 'bicycle' },
    'Motorcycle': { type: 'MaterialCommunityIcons', name: 'motorbike' },
    'Scooter': { type: 'MaterialCommunityIcons', name: 'scooter' },

    // Technology
    'Technology': { type: 'MaterialIcons', name: 'computer' },
    'Mobile': { type: 'Feather', name: 'smartphone' },
    'Hardware': { type: 'MaterialCommunityIcons', name: 'chip' },
    'Cloud': { type: 'MaterialCommunityIcons', name: 'cloud-outline' },
    'Server': { type: 'MaterialCommunityIcons', name: 'server' },
    'Code': { type: 'MaterialCommunityIcons', name: 'code-tags' },
    'Data': { type: 'MaterialCommunityIcons', name: 'database' },
    'Electronics': { type: 'MaterialIcons', name: 'devices' },
    'Computer': { type: 'MaterialIcons', name: 'computer' },
    'Software': { type: 'MaterialCommunityIcons', name: 'microsoft-visual-studio-code' },

    // Shopping
    'Shopping': { type: 'Entypo', name: 'shop' },
    'Online Shopping': { type: 'MaterialCommunityIcons', name: 'shopping' },
    'Discount': { type: 'MaterialCommunityIcons', name: 'sale' },
    'Coupon': { type: 'MaterialCommunityIcons', name: 'ticket-percent' },
    'Clothing': { type: 'Ionicons', name: 'shirt' },
    'Shoes': { type: 'MaterialCommunityIcons', name: 'shoe-heel' },
    'Accessories': { type: 'MaterialCommunityIcons', name: 'watch' },
    'Cosmetics': { type: 'MaterialCommunityIcons', name: 'lipstick' },
    'Jewelry': { type: 'MaterialCommunityIcons', name: 'diamond-stone' },
    'Home Decor': { type: 'MaterialCommunityIcons', name: 'lamp' },
    'Tools': { type: 'MaterialCommunityIcons', name: 'tools' },
    'Stationery': { type: 'FontAwesome5', name: 'pen-nib' },

    // Health & Fitness
    'Health': { type: 'FontAwesome5', name: 'heartbeat' },
    'Medical': { type: 'MaterialIcons', name: 'local-hospital' },
    'Pharmacy': { type: 'MaterialCommunityIcons', name: 'pill' },
    'Vitamins': { type: 'MaterialCommunityIcons', name: 'bottle-tonic-plus' },
    'Sports': { type: 'MaterialIcons', name: 'sports-soccer' },
    'Gym': { type: 'MaterialCommunityIcons', name: 'dumbbell' },
    'Yoga': { type: 'MaterialCommunityIcons', name: 'yoga' },
    'Doctor': { type: 'FontAwesome5', name: 'user-md' },
    'Dentist': { type: 'MaterialCommunityIcons', name: 'tooth' },
    'Therapy': { type: 'MaterialCommunityIcons', name: 'brain' },
    'Eyes': { type: 'MaterialCommunityIcons', name: 'glasses' },

    // Leisure & Activities (Expanded)
    'Leisure': { type: 'MaterialIcons', name: 'weekend' },
    'Hiking': { type: 'MaterialCommunityIcons', name: 'hiking' },
    'Swimming': { type: 'MaterialCommunityIcons', name: 'swim' },
    'Cycling': { type: 'MaterialCommunityIcons', name: 'bike' },
    'Running': { type: 'MaterialCommunityIcons', name: 'run' },
    'Fishing': { type: 'MaterialCommunityIcons', name: 'fish' },
    'Camping': { type: 'MaterialCommunityIcons', name: 'tent' },

    // Entertainment
    'Entertainment': { type: 'MaterialIcons', name: 'movie' },
    'Movies': { type: 'MaterialCommunityIcons', name: 'movie-open' },
    'Concert': { type: 'MaterialCommunityIcons', name: 'microphone-variant' },
    'Theater': { type: 'FontAwesome5', name: 'theater-masks' },
    'Games': { type: 'Ionicons', name: 'game-controller' },
    'Music': { type: 'Feather', name: 'music' },
    'Streaming': { type: 'MaterialCommunityIcons', name: 'netflix' },
    'Subscriptions': { type: 'MaterialIcons', name: 'subscriptions' },
    'Books': { type: 'Entypo', name: 'book' },
    'Hobbies': { type: 'Ionicons', name: 'color-palette' },
    'Photography': { type: 'MaterialIcons', name: 'camera' },
    'Art': { type: 'MaterialCommunityIcons', name: 'palette' },

    // Education
    'Education': { type: 'Ionicons', name: 'school' },
    'Tuition': { type: 'MaterialCommunityIcons', name: 'bank-transfer' },
    'Courses': { type: 'MaterialCommunityIcons', name: 'certificate' },
    'School Supplies': { type: 'MaterialCommunityIcons', name: 'pencil-ruler' },

    // Personal Care
    'Personal Care': { type: 'MaterialCommunityIcons', name: 'face-man-shimmer' },
    'Barber': { type: 'MaterialCommunityIcons', name: 'content-cut' },
    'Hair Salon': { type: 'MaterialCommunityIcons', name: 'hair-dryer' },
    'Spa': { type: 'MaterialCommunityIcons', name: 'spa' },
    'Nails': { type: 'MaterialCommunityIcons', name: 'hand-wash' },

    // Family & Kids
    'Family': { type: 'MaterialIcons', name: 'family-restroom' },
    'Kids': { type: 'MaterialIcons', name: 'child-care' },
    'Baby': { type: 'MaterialCommunityIcons', name: 'baby-carriage' },
    'Toys': { type: 'MaterialCommunityIcons', name: 'toy-brick' },
    'Childcare': { type: 'MaterialCommunityIcons', name: 'human-female-girl' },
    'Elder Care': { type: 'MaterialCommunityIcons', name: 'human-cane' },

    // Pets
    'Pets': { type: 'MaterialIcons', name: 'pets' },
    'Vet': { type: 'FontAwesome5', name: 'clinic-medical' },
    'Pet Food': { type: 'MaterialCommunityIcons', name: 'bone' },
    'Pet Grooming': { type: 'MaterialIcons', name: 'content-cut' },

    // Travel
    'Travel': { type: 'FontAwesome5', name: 'plane-departure' },
    'Hotel': { type: 'FontAwesome', name: 'hotel' },
    'Visa': { type: 'MaterialCommunityIcons', name: 'passport' },
    'Vacation': { type: 'MaterialIcons', name: 'beach-access' },
    'Cruise': { type: 'MaterialCommunityIcons', name: 'ferry' },

    // Finance & Professional
    'Bank Fees': { type: 'MaterialCommunityIcons', name: 'bank-minus' },
    'Taxes': { type: 'MaterialCommunityIcons', name: 'bank-transfer' },
    'Fines': { type: 'MaterialCommunityIcons', name: 'gavel' },
    'Insurance': { type: 'FontAwesome5', name: 'file-contract' },
    'Loans': { type: 'MaterialCommunityIcons', name: 'bank' },
    'Debt': { type: 'FontAwesome5', name: 'hand-holding-usd' },
    'Legal': { type: 'MaterialIcons', name: 'policy' },
    'Business': { type: 'MaterialIcons', name: 'business-center' },
    'Wallet': { type: 'Entypo', name: 'wallet' },
    'Credit Card': { type: 'FontAwesome', name: 'credit-card' },
    'Savings': { type: 'MaterialCommunityIcons', name: 'piggy-bank' },
    'Piggy Bank': { type: 'MaterialCommunityIcons', name: 'piggy-bank-outline' },

    // Social & Life
    'Social': { type: 'Ionicons', name: 'people' },
    'Charity': { type: 'MaterialCommunityIcons', name: 'charity' },
    'Gifts': { type: 'MaterialCommunityIcons', name: 'gift' },
    'Donation': { type: 'FontAwesome5', name: 'donate' },
    'Celebration': { type: 'MaterialCommunityIcons', name: 'party-popper' },
    'Wedding': { type: 'MaterialCommunityIcons', name: 'ring' },
    'Dating': { type: 'MaterialCommunityIcons', name: 'heart' },
};

export const CATEGORY_GROUPS: CategoryGroup[] = [
    {
        title: 'General & Income',
        data: ['Other', 'General', 'Income', 'Salary', 'Freelance', 'Investment', 'Bonus', 'Dividends', 'Rental Income', 'Refund', 'Sale', 'Grants']
    },
    {
        title: 'Work & Office',
        data: ['Work', 'Meeting', 'Project', 'Client', 'Deadline', 'Coworking', 'Office']
    },
    {
        title: 'Food & Drink',
        data: ['Food', 'Restaurants', 'Coffee', 'Groceries', 'Drinks', 'Alcohol', 'Fast Food', 'Pizza', 'Dessert', 'Bakery', 'Vegetarian', 'Sushi', 'Delivery', 'Snacks']
    },
    {
        title: 'Transportation',
        data: ['Transport', 'Fuel', 'Taxi', 'Rideshare', 'Public Transport', 'Metro', 'Train', 'Flight', 'Car Maintenance', 'Car Wash', 'Parking', 'Tolls', 'Bicycle', 'Motorcycle', 'Scooter']
    },
    {
        title: 'Household & Utilities',
        data: ['Bills', 'Rent', 'Mortgage', 'Electricity', 'Water', 'Gas', 'Internet', 'Phone', 'Cable TV', 'Maintenance', 'Repairs', 'Furniture', 'Cleaning', 'Garden', 'Security', 'Kitchen', 'Laundry', 'Bedroom', 'Bathroom', 'Decor']
    },
    {
        title: 'Technology',
        data: ['Technology', 'Mobile', 'Hardware', 'Cloud', 'Server', 'Code', 'Data', 'Electronics', 'Computer', 'Software']
    },
    {
        title: 'Shopping',
        data: ['Shopping', 'Online Shopping', 'Discount', 'Coupon', 'Clothing', 'Shoes', 'Accessories', 'Cosmetics', 'Jewelry', 'Home Decor', 'Tools', 'Stationery']
    },
    {
        title: 'Health & Fitness',
        data: ['Health', 'Medical', 'Pharmacy', 'Vitamins', 'Sports', 'Gym', 'Yoga', 'Doctor', 'Dentist', 'Therapy', 'Eyes']
    },
    {
        title: 'Leisure & Activities',
        data: ['Leisure', 'Hiking', 'Swimming', 'Cycling', 'Running', 'Fishing', 'Camping']
    },
    {
        title: 'Entertainment',
        data: ['Entertainment', 'Movies', 'Concert', 'Theater', 'Games', 'Music', 'Streaming', 'Subscriptions', 'Books', 'Hobbies', 'Photography', 'Art']
    },
    {
        title: 'Education',
        data: ['Education', 'Tuition', 'Courses', 'School Supplies']
    },
    {
        title: 'Personal Care',
        data: ['Personal Care', 'Barber', 'Hair Salon', 'Spa', 'Nails']
    },
    {
        title: 'Family & Kids',
        data: ['Family', 'Kids', 'Baby', 'Toys', 'Childcare', 'Elder Care']
    },
    {
        title: 'Pets',
        data: ['Pets', 'Vet', 'Pet Food', 'Pet Grooming']
    },
    {
        title: 'Travel',
        data: ['Travel', 'Hotel', 'Visa', 'Vacation', 'Cruise']
    },
    {
        title: 'Finance & Professional',
        data: ['Bank Fees', 'Taxes', 'Fines', 'Insurance', 'Loans', 'Debt', 'Legal', 'Business', 'Wallet', 'Credit Card', 'Savings', 'Piggy Bank']
    },
    {
        title: 'Social & Life',
        data: ['Social', 'Charity', 'Gifts', 'Donation', 'Celebration', 'Wedding', 'Dating']
    },
];

// Helper function to get icon for a category, fallback to 'Other' if not found
export const getCategoryIcon = (categoryName: string): CategoryIconConfig => {
    return CATEGORY_ICONS[categoryName] || CATEGORY_ICONS['Other'];
};
