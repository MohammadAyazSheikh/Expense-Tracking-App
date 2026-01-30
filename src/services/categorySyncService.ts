import { database } from '@/libs/database'
import { supabase } from '@/libs/supabase'
import { Q } from '@nozbe/watermelondb'
import { mmkvStorage } from "@/utils/storage"
import NetInfo from '@react-native-community/netinfo';
import { Category } from '@/database/models/category';
import { PendingDeletions } from '@/database/models/local';

const LAST_SYNC_KEY = 'last_sync_timestamp';

class CategorySyncService {
  private isSyncingDltPull = false;
  private isSyncingDltPush = false;
  private isSyncingChangesPull = false;
  private isSyncingChangesPush = false;

  async getLastSyncTimestamp(): Promise<number> {
    const timestamp = await mmkvStorage.getItem(LAST_SYNC_KEY);
    return timestamp ? parseInt(timestamp) : 0;
  }

  async setLastSyncTimestamp(timestamp: number) {
    await mmkvStorage.setItem(LAST_SYNC_KEY, timestamp.toString());
  }

  // Pull deletions from trash
  async pullDeletions(userId: string, lastSync: number) {
    if (this.isSyncingDltPull) return;

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      console.log('Offline - skipping pull');
      return;
    }

    this.isSyncingDltPull = true;
    try {
      // Fetch trash since last sync
      const { data: trashData, error } = await supabase
        .from('trash')
        .select('*')
        .eq('deleted_by', userId)
        .gt('deleted_at', new Date(lastSync).toISOString())
        .order('deleted_at', { ascending: true });


      if (error) throw error

      console.log(`🔥 Found ${trashData?.length} deletions to apply`)

      // Group by table name
      const byTable: Record<string, string[]> = {}
      trashData.forEach(trash => {
        if (!byTable[trash.table_name]) {
          byTable[trash.table_name] = [];
        }
        byTable[trash.table_name].push(trash.record_id);
      })

      // Delete from local DB
      await database.write(async () => {
        for (const [tableName, recordIds] of Object.entries(byTable)) {
          const collection = database.collections.get(tableName)

          for (const recordId of recordIds) {
            const existing = await collection
              .query(Q.where('server_id', recordId))
              .fetch()

            if (existing.length > 0) {
              console.log(`Deleting local ${tableName}: ${recordId}`)
              await existing[0].destroyPermanently()
            }
          }
        }
      })

      return trashData.length
    } catch (error) {
      console.error('Failed to pull deletions:', error)
      throw error
    }
    finally {
      this.isSyncingDltPull = false;
    }
  }

  //push deletions when online
  async pushDeletions() {
    if (this.isSyncingDltPush) return;

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      console.log('Offline - skipping push');
      return;
    }

    this.isSyncingDltPush = true;

    const pendingDeletionsCollection = database.collections.get<PendingDeletions>('pending_deletions')
    const pending = await pendingDeletionsCollection.query().fetch()
    for (const deletion of pending) {
      try {
        // Delete from server (creates tombstone)
        const { error } = await supabase
          .from(deletion.tableName as any)
          .delete()
          .eq('id', deletion.serverId)
        if (!error) {
          // Successfully synced, remove from pending
          await database.write(async () => {
            await deletion.destroyPermanently();
          });
        }
        throw error;
      } catch (error) {
        console.error('Failed to push deletion:', error)
      }
      finally {
        this.isSyncingDltPush = false;
      }
    }
    console.log(`🔥Pushed ${pending.length}  deletions to server`);
    return pending.length;
  }

  // Pull updates/inserts
  async pullChanges(userId: string, lastSync: number) {

    if (this.isSyncingChangesPull) return;
    try {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        console.log('Offline - skipping pull');
        return;
      }
      this.isSyncingChangesPull = true;
      // Fetch categories updated since last sync
      const { data: serverCategories, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .gt('updated_at', new Date(lastSync).toISOString())
        .order('updated_at', { ascending: true })

      if (error) throw error

      console.log(`🔥Found ${serverCategories.length} updates to apply`)

      const categoriesCollection = database.collections.get<Category>('categories')

      await database.write(async () => {
        for (const serverCat of serverCategories) {
          const existing = await categoriesCollection
            .query(Q.where('server_id', serverCat.id))
            .fetch();

          if (existing.length > 0) {
            // Update existing
            await existing[0].update(cat => {
              cat.name = serverCat.name
              cat.color = serverCat.color
              cat.icon = serverCat.icon
              cat.iconFamily = serverCat.icon_family
              cat.transactionTypeKey = serverCat.transaction_type_key
              cat.systemCategoryId = serverCat.system_category_id
              cat.isSynced = true
            })
          } else {
            // Create new
            await categoriesCollection.create(cat => {
              cat.serverId = serverCat.id
              cat.name = serverCat.name
              cat.color = serverCat.color
              cat.icon = serverCat.icon
              cat.iconFamily = serverCat.icon_family
              cat.transactionTypeKey = serverCat.transaction_type_key
              cat.userId = serverCat.user_id
              cat.systemCategoryId = serverCat.system_category_id
              cat.isSynced = true
            })
          }
        }
      })

      return serverCategories.length
    } catch (error) {
      console.error('Failed to pull changes:', error)
      throw error
    }
    finally {
      this.isSyncingChangesPull = false;
    }
  }

  // Push local changes updates/inserts
  async pushChanges(userId: string) {

    if (this.isSyncingChangesPush) return;

    try {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        console.log('Offline - skipping push');
        return;
      }

      this.isSyncingChangesPush = true;

      const categoriesCollection = database.collections.get<Category>('categories')

      // Find unsynced records
      const unsyncedCategories = await categoriesCollection
        .query(Q.where('is_synced', false))
        .fetch()

      for (const category of unsyncedCategories) {
        try {
          if (category.serverId) {
            // Update existing on server
            const { error } = await supabase
              .from('categories')
              .update({
                name: category.name,
                color: category.color,
                icon: category.icon,
                icon_family: category.iconFamily,
                transaction_type_key: category.transactionTypeKey,
                system_category_id: category.systemCategoryId,
                updated_at: new Date().toISOString(),
              })
              .eq('id', category.serverId)

            if (error) throw error

            await database.write(async () => {
              await category.update(cat => {
                cat.isSynced = true
              })
            })
          } else {
            // Insert new on server
            const { data, error } = await supabase
              .from('categories')
              .insert({
                name: category.name,
                color: category.color,
                icon: category.icon,
                icon_family: category.iconFamily,
                transaction_type_key: category.transactionTypeKey,
                user_id: userId,
                system_category_id: category.systemCategoryId,
              })
              .select()
              .single()

            if (error) throw error

            await database.write(async () => {
              await category.update(cat => {
                cat.serverId = data.id
                cat.isSynced = true
              })
            })
          }
        } catch (error) {
          console.error('Failed to sync category:', category.id, error)
        }
      }
      console.log(`🔥 Pushed ${unsyncedCategories.length} local changes to server`);
      return unsyncedCategories.length
    } finally {
      this.isSyncingChangesPush = false
    }
  }

  // //delete function when online
  // async deleteCategoryWhenOnline(categoryId: string) {
  //   const categoriesCollection = database.collections.get<Category>('categories')
  //   const category = await categoriesCollection.find(categoryId)

  //   const serverId = category.serverId

  //   // Delete from local DB immediately (optimistic)
  //   await database.write(async () => {
  //     await category.destroyPermanently();
  //   })

  //   // Delete from server (trigger will create tombstone)
  //   if (serverId) {
  //     try {
  //       const { error } = await supabase
  //         .from('categories')
  //         .delete()
  //         .eq('id', serverId)

  //       if (error) {
  //         console.error('Failed to delete from server:', error)
  //         // TODO: Handle offline - queue for later
  //       }
  //     } catch (error) {
  //       console.error('Failed to delete category:', error)
  //     }
  //   }
  // }


  // //delete function when offline
  // async deleteCategoryWhenOffline(categoryId: string) {
  //   const categoriesCollection = database.collections.get<Category>('categories');
  //   const pendingDeletionsCollection = database.collections.get<PendingDeletions>('pending_deletions');
  //   const category = await categoriesCollection.find(categoryId);

  //   const serverId = category.serverId;

  //   await database.write(async () => {
  //     // Delete locally
  //     await category.destroyPermanently()

  //     // Track for sync if it has a server ID
  //     if (serverId) {
  //       await pendingDeletionsCollection.create(deletion => {
  //         deletion.tableName = 'categories';
  //         deletion.serverId = serverId;
  //         deletion.deletedAt = Date.now();
  //       })
  //     }
  //   })

  //   // Try to sync immediately if online
  //   // syncService.pushPendingDeletions()
  // }




  // Full sync
  async sync(userId: string) {
    const lastSync = await this.getLastSyncTimestamp();
    const currentTimestamp = Date.now();

    console.log(`Starting sync (last: ${new Date(lastSync).toISOString()})`);

    // 1. Pull deletions first (remove obsolete data)
    const deletionPullCount = await this.pullDeletions(userId, lastSync);

    // 2. Push deletions
    const deletionPushCount = await this.pushDeletions();

    // 3. Pull updates/inserts
    const updateCount = await this.pullChanges(userId, lastSync);

    // 4. Push local changes
    const pushCount = await this.pushChanges(userId)

    // 5. Update sync timestamp
    await this.setLastSyncTimestamp(currentTimestamp)

    console.log(`Sync complete: ${deletionPullCount} deleted, ${deletionPushCount} deleted, ${updateCount} updated, ${pushCount} pushed`)

    return { deletionPullCount, deletionPushCount, updateCount, pushCount }
  }
}

export const categorySyncService = new CategorySyncService();