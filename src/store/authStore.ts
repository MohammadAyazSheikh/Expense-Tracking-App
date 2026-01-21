import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../utils/storage';
import { supabase } from '@/utils/supabase';
import Toast from 'react-native-toast-message';

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string
  avatar?: string;
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (data: { user: { email: string, password: string }, onSuccess?: () => void }) => Promise<void>;
  register: (data: { user: { email: string, password: string, firstName: string; lastName: string }, onSuccess: () => void }) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  sendOTP: (email: string, type: 'signup' | 'forgot_password') => Promise<void>;
  verifyOTP: (email: string, code: string, type: 'signup' | 'forgot_password', name?: string) => Promise<boolean>;
  resetPassword: (email: string, newPass: string, code: string) => Promise<void>;
}


const data = {
  user: {
    id: "123",
    name: "John",
    email: "john@yopmail.com"
  },
  token: "token",
  refreshToken: "refershToken",
  isAuthenticated: true,
  isLoading: false,
  error: null,
}



export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (data: { user: { email: string, password: string }, onSuccess?: () => void }) => {
        set({ isLoading: true, error: null });
        try {
          const {
            data: { session, user },
            error,
          } = await supabase.auth.signInWithPassword({
            email: data.user.email,
            password: data.user.password,
          })
          console.log({
            user,
            session,
            error
          })
          if (error) {
            throw error
          }
          if (session) {

            set({
              isLoading: false,
              user: {
                id: "123",
                email: "test@email.com",
                username: "John",
                firstName: "John",
                lastName: "Doe",
                avatar: "https://example.com/avatar.jpg",
              },
              isAuthenticated: true,
            })
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Registration failed';
          Toast.show({
            type: "error",
            text1: "Error",
            text2: errorMsg!,
          });
          set({
            error: errorMsg,
            isLoading: false,
          });
          throw error;
        }
      },

      // Register action
      register: async ({ onSuccess, user: userData }) => {

        set({ isLoading: true, error: null });
        try {
          const {
            data: { session, user },
            error,
          } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
              emailRedirectTo: 'hisaabbee://user-verification'
            }
          })
          console.log({
            user,
            session,
            error
          })
          if (error) {
            throw error
          }
          if (!session) {
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Please check your inbox for email verification!",
            });

            set({
              isLoading: false,
            })
            onSuccess();
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Registration failed';
          Toast.show({
            type: "error",
            text1: "Error",
            text2: errorMsg!,
          });
          set({
            error: errorMsg,
            isLoading: false,
          });
          throw error;
        }
      },

      // Logout action
      logout: async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.message,
          });
        }
        else {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Logged out successfully!",
          });
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      // Refresh authentication
      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        set({ isLoading: true });
        try {
          // Replace with your actual API call
          const response = await fetch('YOUR_API_URL/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (!response.ok) {
            throw new Error('Token refresh failed');
          }

          const data = await response.json();

          set({
            token: data.token,
            refreshToken: data.refreshToken,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Token refresh failed',
            isLoading: false,
          });
          get().logout();
          throw error;
        }
      },

      // Update user data
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },


      // Set loading
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      sendOTP: async (email: string, type: 'signup' | 'forgot_password') => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1500)); // Mock API delay
          console.log(`[Mock OTP] Sent to ${email} for ${type}: 123456`);
          set({ isLoading: false });
        } catch (error) {
          set({
            error: "Failed to send OTP",
            isLoading: false,
          });
          throw error;
        }
      },

      verifyOTP: async (email: string, code: string, type: 'signup' | 'forgot_password', name?: string) => {
        return Promise.reject("Not implemented")
      },

      resetPassword: async (email: string, newPass: string, code: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          // Mock reset
          console.log(`[Mock Reset] Password reset for ${email} to ${newPass} with code ${code}`);
          set({ isLoading: false });
        } catch (error) {
          set({ error: "Failed to reset password", isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
