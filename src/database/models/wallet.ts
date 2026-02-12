import { Model, Relation } from '@nozbe/watermelondb';
import { field, readonly, date, relation } from '@nozbe/watermelondb/decorators';
import { Currencies } from './currency';

export class WalletTypes extends Model {
    static table = 'wallet_types';

    @field('key') key!: string;
    @field('label') label!: string;
    @field('color') color!: string;
    @field('icon') icon!: string;
    @field('icon_family') iconFamily!: string;
    @field('is_synced') isSynced!: boolean;
    @field('server_id') serverId!: string | null;
    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
}

export class Wallet extends Model {
    static table = 'wallets';

    @field('name') name!: string;
    @field('user_id') userId!: string;
    @field('balance') balance!: number;
    @field('is_default') isDefault!: boolean;
    @field('currency_id') currencyId!: string;
    @field('wallet_type_id') walletTypeId!: string;
    @field('include_in_total') includeInTotal!: boolean;
    @field('last_digits') lastDigits!: string | null;
    @field('account_number') accountNumber!: string | null;
    @field('is_synced') isSynced!: boolean;
    @field('server_id') serverId!: string | null;
    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;

    // Relations
    @relation('currencies', 'currency_id') currency!: Relation<Currencies>;
    @relation('wallet_types', 'wallet_type_id') walletType!: Relation<WalletTypes>;
}