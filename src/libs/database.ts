import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from '@/database/schema';
import { Category, SystemCategory } from '@/database/models/category';
import { PendingDeletions, SyncState } from '@/database/models/local';
import { Tag } from '@/database/models/tags';

const adapter = new SQLiteAdapter({
    schema,
    dbName: 'expense_tracker',
});

export const database = new Database({
    adapter,
    modelClasses: [Category, SystemCategory, PendingDeletions, SyncState, Tag],
});