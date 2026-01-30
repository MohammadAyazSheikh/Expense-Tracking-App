import { Database } from '@/types/supabaseDbTypes';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Trash = Database['public']['Tables']['trash']['Row'];
type Categories = Database['public']['Tables']['categories']['Row'];
type System_Categories = Database['public']['Tables']['system_categories']['Row'];
type Transactions_Types = Database['public']['Tables']['transaction_types']['Row'];

export {
    Trash,
    Profile,
    Categories,
    System_Categories,
    Transactions_Types,
}

