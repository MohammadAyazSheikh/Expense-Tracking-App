// hooks/useNetworkSync.ts
import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { syncService } from '@/services/syncService';
import { supabase } from '@/libs/supabase';

export function useNetworkSync() {
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(async (state) => {
            if (state.isConnected) {
                console.log('Network restored - 🏁 Starting to sync... ');
                const user = await supabase.auth.getUser();
                if (user.data.user) {
                    console.log('⏳ Syncing data for user:', user.data.user.id);
                    await syncService.sync(user.data.user.id);
                }
                console.log('Network Data Synced ✅');
            }
        });

        return () => unsubscribe();
    }, []);
}