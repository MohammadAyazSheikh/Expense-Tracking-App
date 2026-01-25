import { Database } from '@/types/supabaseDbTypes';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Categories = Database['public']['Tables']['categories']['Row'];
type System_Categories = Database['public']['Tables']['system_categories']['Row'];
type Transactions_Types = Database['public']['Tables']['transaction_types']['Row'];

export {
    Profile,
    Categories,
    System_Categories,
    Transactions_Types
}

