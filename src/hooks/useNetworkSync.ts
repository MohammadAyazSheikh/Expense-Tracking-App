// hooks/useNetworkSync.ts
import { useEffect } from 'react';
import { supabase } from '@/libs/supabase';
import NetInfo from '@react-native-community/netinfo';
import { syncOrchestrator } from '@/services/syncServices/syncOrchestrator';

export function useNetworkSync() {
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(async (state) => {
            if (state.isConnected) {
                console.log('Network restored - 🏁 Starting full sync...');
                const user = await supabase.auth.getUser();
                if (user.data.user) {
                    await syncOrchestrator.syncAll(user.data.user.id);
                }
                console.log('Network Data Synced ✅');
            }
        });

        return () => unsubscribe();
    }, []);
}