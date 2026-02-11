import { createTable, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
    migrations: [
        {
            toVersion: 2,
            steps: [
                createTable({
                    name: 'wallets',
                    columns: [
                        { name: 'name', type: 'string' },
                        { name: 'user_id', type: 'string' },
                        { name: 'balance', type: 'number' },
                        { name: 'is_default', type: 'boolean' },
                        { name: 'currency_id', type: 'string' },
                        { name: 'wallet_type_id', type: 'string' },
                        { name: 'include_in_total', type: 'boolean' },
                        { name: 'last_digits', type: 'string', isOptional: true },
                        { name: 'account_number', type: 'string', isOptional: true },
                        { name: 'is_synced', type: 'boolean' },
                        { name: 'server_id', type: 'string', isOptional: true },
                        { name: 'created_at', type: 'number' },
                        { name: 'updated_at', type: 'number' },
                    ],
                }),
            ],
        },
    ],
})