import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class PendingDeletions extends Model {
    static table = 'pending_deletions';

    @field('table_name') tableName!: string;
    @field('server_id') serverId!: string | null; // Supabase UUID
    @field('deleted_at') deletedAt!: number;
}


export class SyncState extends Model {
    static table = 'sync_state';

    @field('table_name') tableName!: string;
    @field('last_synced_at') lastSyncedAt!: number;
}