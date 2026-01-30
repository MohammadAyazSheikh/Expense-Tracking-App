import { Database } from '@/types/supabse/supabaseDbTypes';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Trash = Database['public']['Tables']['trash']['Row'];
type Categories = Database['public']['Tables']['categories']['Row'];
type SystemCategories = Database['public']['Tables']['system_categories']['Row'];
type TransactionsTypes = Database['public']['Tables']['transaction_types']['Row'];
type SupabaseTableNames = keyof Database['public']['Tables'];

export {
    Trash,
    Profile,
    Categories,
    SystemCategories,
    TransactionsTypes,
    SupabaseTableNames
}

