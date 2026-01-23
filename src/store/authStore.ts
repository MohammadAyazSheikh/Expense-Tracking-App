import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../utils/storage';
import { supabase } from '@/utils/supabase';
import Toast from 'react-native-toast-message';

interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string
  avatar?: string;
}

interface AuthState {
  // State
  user: User | null;
  verificationStatus: "verified" | 'unverified' | 'pending';
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  logout: () => void;
  login: (data: { user: { email: string, password: string }, onSuccess?: () => void }) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  confirmEmail: (access_token: string, refresh_token: string, type: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}



export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => (
      {
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        verificationStatus: "unverified",
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

            if (error) {
              throw error
            }
            if (session) {
              const { data: userData, error } = await supabase.from("users").select("*").eq("id", user.id).single()
              if (error) throw error;
              set({
                user: {
                  id: user.id,
                  email: user.email!,
                  username: userData?.username,
                  firstName: userData?.first_name,
                  lastName: userData?.last_name,
                  avatar: userData?.avatar_url,
                },
                verificationStatus: session?.user?.confirmed_at ? "verified" : "pending",
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
            });
            throw error;
          }
          finally {
            set({ isLoading: false });
          }
        },

        // Signup action (simplified - just email/password)
        signup: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const { data, error, } = await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: 'hisaabbee://user-verification'
              }
            });

            if (error) {
              throw error;
            }

            if (data.user) {
              // Store minimal user data
              set({
                user: {
                  id: data?.user?.id,
                  email: data?.user?.email!,
                },
                verificationStatus: "pending",
                isAuthenticated: false,
              });
            }

            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Please check your email to verify your account!",
            });

          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Signup failed';
            Toast.show({
              type: "error",
              text1: "Error",
              text2: errorMsg,
            });
            set({
              error: errorMsg,
            });
            throw error;
          }
          finally {
            set({ isLoading: false });
          }
        },
        confirmEmail: async (access_token: string, refresh_token: string, type: string) => {
          set({ isLoading: true, error: null });
          try {
            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (error) throw error;

            if (data.session) {
              if (type === 'recovery') {
                Toast.show({
                  type: "waning",
                  text1: "Success",
                  text2: "Reset password feature not implemented yet!",
                });
              } else {
                set({
                  isAuthenticated: true,
                  verificationStatus: "verified",
                  user: {
                    ...get().user,
                    id: data.session.user.id,
                    email: data.session.user.email!,
                  },
                });
                Toast.show({
                  type: "success",
                  text1: "Success",
                  text2: "Email verified successfully!",
                });
              }
            }
          } catch (error: any) {
            set({ isLoading: false });
            Toast.show({
              type: "error",
              text1: "Error",
              text2: error.message || 'Failed to process verification link',
            });
          }
          finally {
            set({ isLoading: false });
          }
        },
        // Logout action
        logout: async () => {

          set({ isLoading: true, error: null });
          try {
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
                isAuthenticated: false,
                isLoading: false,
                error: null,
                verificationStatus: "unverified",
              });
            }
          } catch (error: any) {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: error.message || 'Failed to logout',
            });
          }
          finally {
            set({ isLoading: false });
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



        resetPassword: async (email: string, newPass: string, code: string) => {

        },
      }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        verificationStatus: state.verificationStatus,
      }),
    }
  )
);
