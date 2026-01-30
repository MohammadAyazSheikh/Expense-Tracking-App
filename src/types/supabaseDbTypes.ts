export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            categories: {
                Row: {
                    color: string | null
                    created_at: string
                    icon: string | null
                    icon_family: string | null
                    id: string
                    name: string
                    system_category_id: string | null
                    transaction_type_key: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    color?: string | null
                    created_at?: string
                    icon?: string | null
                    icon_family?: string | null
                    id?: string
                    name: string
                    system_category_id?: string | null
                    transaction_type_key: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    color?: string | null
                    created_at?: string
                    icon?: string | null
                    icon_family?: string | null
                    id?: string
                    name?: string
                    system_category_id?: string | null
                    transaction_type_key?: string
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "categories_system_category_id_fkey"
                        columns: ["system_category_id"]
                        isOneToOne: false
                        referencedRelation: "system_categories"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "fk_categories_transaction_type"
                        columns: ["transaction_type_key"]
                        isOneToOne: false
                        referencedRelation: "transaction_types"
                        referencedColumns: ["key"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    device_token: string | null
                    first_name: string | null
                    id: string
                    is_admin: boolean
                    last_name: string | null
                    updated_at: string | null
                    username: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    device_token?: string | null
                    first_name?: string | null
                    id: string
                    is_admin?: boolean
                    last_name?: string | null
                    updated_at?: string | null
                    username?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    device_token?: string | null
                    first_name?: string | null
                    id?: string
                    is_admin?: boolean
                    last_name?: string | null
                    updated_at?: string | null
                    username?: string | null
                }
                Relationships: []
            }
            system_categories: {
                Row: {
                    color: string | null
                    created_at: string
                    icon: string | null
                    icon_family: string | null
                    id: string
                    is_active: boolean
                    name: string
                    transaction_type_key: string
                    updated_at: string
                }
                Insert: {
                    color?: string | null
                    created_at?: string
                    icon?: string | null
                    icon_family?: string | null
                    id?: string
                    is_active?: boolean
                    name: string
                    transaction_type_key: string
                    updated_at?: string
                }
                Update: {
                    color?: string | null
                    created_at?: string
                    icon?: string | null
                    icon_family?: string | null
                    id?: string
                    is_active?: boolean
                    name?: string
                    transaction_type_key?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "fk_system_categories_transaction_type"
                        columns: ["transaction_type_key"]
                        isOneToOne: false
                        referencedRelation: "transaction_types"
                        referencedColumns: ["key"]
                    },
                ]
            }
            transaction_types: {
                Row: {
                    created_at: string | null
                    key: string
                    label: string
                    metadata: Json | null
                }
                Insert: {
                    created_at?: string | null
                    key: string
                    label: string
                    metadata?: Json | null
                }
                Update: {
                    created_at?: string | null
                    key?: string
                    label?: string
                    metadata?: Json | null
                }
                Relationships: []
            }
            trash: {
                Row: {
                    deleted_at: string | null
                    deleted_by: string
                    id: string
                    record_data: Json
                    record_id: string
                    schema_name: string | null
                    table_name: string
                }
                Insert: {
                    deleted_at?: string | null
                    deleted_by: string
                    id?: string
                    record_data?: Json
                    record_id: string
                    schema_name?: string | null
                    table_name: string
                }
                Update: {
                    deleted_at?: string | null
                    deleted_by?: string
                    id?: string
                    record_data?: Json
                    record_id?: string
                    schema_name?: string | null
                    table_name?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            is_admin: { Args: never; Returns: boolean }
            store_in_trash: {
                Args: { p_record: Json; p_schema: string; p_table: string }
                Returns: undefined
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {},
    },
} as const
