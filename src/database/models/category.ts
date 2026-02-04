import { Model } from '@nozbe/watermelondb';
import { field, readonly, date } from '@nozbe/watermelondb/decorators';

export class Category extends Model {
    static table = 'categories';

    @field('name') name!: string;
    @field('color') color!: string;
    @field('icon') icon!: string;
    @field('icon_family') iconFamily!: string;
    @field('transaction_type_key') transactionTypeKey!: string;
    @field('user_id') userId!: string;
    @field('system_category_id') systemCategoryId!: string | null;

    // Sync fields
    @field('server_id') serverId!: string | null;
    @field('is_synced') isSynced!: boolean;
    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
}


export class SystemCategory extends Model {
    static table = 'system_categories';

    @field('name') name!: string;
    @field('color') color!: string;
    @field('icon') icon!: string;
    @field('icon_family') iconFamily!: string;
    @field('transaction_type_key') transactionTypeKey!: string;
    @field('is_active') isActive!: boolean;
    // Sync fields
    @field('server_id') serverId!: string | null;
    @field('is_synced') isSynced!: boolean;
    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
}