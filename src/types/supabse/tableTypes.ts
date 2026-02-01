import { Database } from '@/types/supabse/supabaseDbTypes';

type SupabaseTables = Database['public']['Tables'];
type SupabaseTableNames = keyof SupabaseTables;

type Trash = SupabaseTables['trash']['Row'];
type Profile = SupabaseTables['profiles']['Row'];
type Categories = SupabaseTables['categories']['Row'];
type SystemCategories = SupabaseTables['system_categories']['Row'];
type TransactionsTypes = SupabaseTables['transaction_types']['Row'];




export {
    Trash,
    Profile,
    Categories,
    SystemCategories,
    TransactionsTypes,
    SupabaseTableNames,
    SupabaseTables
}

