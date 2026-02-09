import { Model, Relation } from '@nozbe/watermelondb';
import { field, readonly, date, relation } from '@nozbe/watermelondb/decorators';

export class Currencies extends Model {
    static table = 'currencies';

    @field('code') code!: string;
    @field('decimal_places') decimalPlaces!: number;
    @field('is_active') isActive!: boolean;
    @field('name') name!: string;
    @field('symbol') symbol!: string;
    @field('type') type!: string;
    @field('is_synced') isSynced!: boolean;
    @field('server_id') serverId!: string | null;
    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
}

export class ExchangeRates extends Model {
    static table = 'exchange_rates';

    @field('base_currency_id') baseCurrencyId!: string;
    @field('quote_currency_id') quoteCurrencyId!: string;
    @field('rate') rate!: number;
    @field('rate_date') rateDate!: string;
    @field('source') source!: string;
    @field('is_synced') isSynced!: boolean;
    @field('server_id') serverId!: string | null;
    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;

    // Relations
    @relation('currencies', 'base_currency_id') baseCurrency!: Relation<Currencies>;
    @relation('currencies', 'quote_currency_id') quoteCurrency!: Relation<Currencies>;
}
