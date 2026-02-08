import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'icon', type: 'string' },
        { name: 'icon_family', type: 'string' },
        { name: 'transaction_type_id', type: 'string' },
        { name: 'user_id', type: 'string' },
        { name: 'system_category_id', type: 'string', isOptional: true },
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'is_synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'system_categories',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'icon', type: 'string' },
        { name: 'icon_family', type: 'string' },
        { name: 'transaction_type_id', type: 'string' },
        { name: 'is_active', type: 'boolean' },
        { name: 'is_synced', type: 'boolean' },
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'tags',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'user_id', type: 'string' },
        { name: 'is_synced', type: 'boolean' },
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }), tableSchema({
      name: 'currencies',
      columns: [
        { name: 'code', type: 'string' },
        { name: 'decimal_places', type: 'number' },
        { name: 'is_active', type: 'boolean' },
        { name: 'name', type: 'string' },
        { name: 'symbol', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'is_synced', type: 'boolean' },
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'exchange_rates',
      columns: [
        { name: 'base_currency_id', type: 'string' },
        { name: 'quote_currency_id', type: 'string' },
        { name: 'rate', type: 'number' },
        { name: 'rate_date', type: 'string' },
        { name: 'source', type: 'string' },
        { name: 'is_synced', type: 'boolean' },
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'wallet_types',
      columns: [
        { name: 'key', type: 'string' },
        { name: 'label', type: 'string' },
        { name: 'is_synced', type: 'boolean' },
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    //Local-only table to track what we've deleted
    tableSchema({
      name: 'pending_deletions',
      columns: [
        { name: 'table_name', type: 'string' },
        { name: 'server_id', type: 'string' },
        { name: 'deleted_at', type: 'number' },
      ],
    }),
    // // Local-only table to track what we've seen
    // tableSchema({
    //   name: 'sync_state',
    //   columns: [
    //     { name: 'table_name', type: 'string' },
    //     { name: 'last_sync_at', type: 'number' },
    //   ],
    // }),
  ],
});