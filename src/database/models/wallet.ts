import { Model } from '@nozbe/watermelondb';
import { field, readonly, date } from '@nozbe/watermelondb/decorators';

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