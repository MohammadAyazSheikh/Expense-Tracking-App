import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from '@/models/schema';
import { Category, SystemCategory } from '@/models/category';

const adapter = new SQLiteAdapter({
    schema,
    dbName: 'expense_tracker',
});

export const database = new Database({
    adapter,
    modelClasses: [Category, SystemCategory],
});