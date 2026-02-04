import { Model } from '@nozbe/watermelondb';
import { field, readonly, date } from '@nozbe/watermelondb/decorators';

export class Tag extends Model {
    static table = 'tags';

    @field('name') name!: string;
    @field('color') color!: string;
    @field('user_id') userId!: string;
    // Sync fields
    @field('server_id') serverId!: string | null;
    @field('is_synced') isSynced!: boolean;
    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
}