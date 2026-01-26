import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'color', type: 'string', isOptional: true },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'icon_family', type: 'string', isOptional: true },
        { name: 'transaction_type_key', type: 'string' },
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
        { name: 'color', type: 'string', isOptional: true },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'icon_family', type: 'string', isOptional: true },
        { name: 'transaction_type_key', type: 'string' },
        { name: 'is_active', type: 'boolean' },
        { name: 'server_id', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});