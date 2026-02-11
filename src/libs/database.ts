import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from '@/database/schema';
import { Tag } from '@/database/models/tags';
import { PendingDeletions } from '@/database/models/local';
import { WalletTypes, Wallet } from '@/database/models/wallet';
import { Currencies, ExchangeRates } from '@/database/models/currency';
import { Category, SystemCategory } from '@/database/models/category';


const modelClasses = [
    Tag,
    Wallet,
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