
import { useMutation } from '@tanstack/react-query';
import { supabase } from '../utils/supabase';
import Toast from 'react-native-toast-message';

interface CreateProfileParams {
    userId: string;
    firstName: string;
    lastName: string;
    avatarUri?: string;
    base64?: string;
}

interface ProfileData {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    updated_at: string;
}

// Helper function to decode base64
const decode = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

// Upload avatar to Supabase Storage
const uploadAvatar = async (userId: string, uri: string, base64: string): Promise<string | null> => {
    try {

        // Convert image to blob
        const blob = decode(base64);
        // Create unique filename
        const fileExt = uri.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;
        // Upload to Supabase Storage
        const { error, } = await supabase.storage
            .from('avatars')
            .upload(filePath, blob, {
                contentType: `image/${fileExt}`,
                upsert: true, // replace existing avatar
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw new Error('Failed to upload avatar');
    }
};

// Create or update user profile
const createProfile = async (params: CreateProfileParams): Promise<ProfileData> => {
    const { userId, firstName, lastName, avatarUri, base64 } = params;

    // Upload avatar if provided
    let avatarUrl: string | null = null;
    if (avatarUri) {
        avatarUrl = await uploadAvatar(userId, avatarUri, base64!);
    }

    // Create/update profile in database
    const { data, error } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            first_name: firstName,
            last_name: lastName,
            avatar_url: avatarUrl,
        })
        .select()
        .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create profile');

    return data;
};

// TanStack Query mutation hook
export const useCreateProfile = () => {
    return useMutation({
        mutationFn: createProfile,
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Profile updated successfully!',
            });
        },
        onError: (error: Error) => {
            console.error('Error updating profile:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Failed to update profile',
            });
        },
    });
};
