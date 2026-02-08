import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from '@/database/schema';
import { Tag } from '@/database/models/tags';
import { WalletTypes } from '@/database/models/wallet';
import { PendingDeletions } from '@/database/models/local';
import { Currencies, ExchangeRates } from '@/database/models/currency';
import { Category, SystemCategory } from '@/database/models/category';


const modelClasses = [
    Tag,
    Category,
    Currencies,
    WalletTypes,
    ExchangeRates,
    SystemCategory,
    PendingDeletions,
]

const adapter = new SQLiteAdapter({
    schema,
    dbName: 'expense_tracker',
});

export const database = new Database({
    adapter,
    modelClasses
});