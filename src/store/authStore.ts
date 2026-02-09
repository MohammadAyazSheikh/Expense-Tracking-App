import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../utils/storage';
import { supabase } from '@/libs/supabase';
import Toast from 'react-native-toast-message';
import { DEEP_LINKS } from '@/data/constants/deepLinks';
import { translate } from '@/i18n';
import { cleanupService } from '@/services/syncServices/cleanupService';
import { syncOrchestrator } from '@/services/syncServices/syncOrchestrator';
import { useAppSettingsStore } from './appSettingsStore';

interface User {
  id: string;
  email: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  avatar?: string | null;
}
type VerificationStatus = "VERIFIED" | 'SINGED_OUT' | 'VERIFICATION_PENDING' | 'RESET_PASSWORD';

interface AuthState {
  // State
  user: User | null;
  verificationStatus: VerificationStatus;
  isLoading: boolean;
  error: string | null;

  // Actions
  logout: () => void;
  login: (data: { user: { email: string, password: string }, onSuccess?: () => void }) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  changePassword: (data: { password: string }) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
  confirmEmail: (codes: {
    access_token: string | null,
    refresh_token: string | null,
    type: string | null,
    error?: string | null,
    error_code?: string | null,
    error_description?: string | null
  }) => Promise<void>;

}



export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => (
      {
        // Initial state
        user: null,
        isLoading: false,
        error: null,
        verificationStatus: "SINGED_OUT",

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
              const { data: userData, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
              if (error) throw error;
              set({
                user: {
                  id: user.id,
                  email: user.email!,
                  username: userData?.username,
                  lastName: userData?.last_name,
                  firstName: userData?.first_name,
                  avatar: userData?.avatar_url,
                  fullName: userData?.first_name + " " + userData?.last_name,
                },
                verificationStatus: session?.user?.confirmed_at ? "VERIFIED" : "VERIFICATION_PENDING",
              });
              await syncOrchestrator.syncAll(user.id);
              await useAppSettingsStore.getState().setDefaultCurrency();
            }
          } catch (error: any) {
            const errorMsg = error.message || 'Login failed';
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

        // Signup action 
        signup: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const { data, error, } = await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: DEEP_LINKS.VERIFY_EMAIL
              }
            });
            if (error) {
              throw error;
            }
            if (data?.user) {
              set({
                user: {
                  id: data?.user?.id,
                  email: data?.user?.email!,
                },
                verificationStatus: "VERIFICATION_PENDING",
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
        // Confirm email action
        confirmEmail: async ({ access_token, refresh_token, error, error_code, error_description, type }) => {

          if (error_code || error) {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: error_description || translate("errors.somethingWentWrong"),
            });
            return;
          }

          if (!access_token || !refresh_token) {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Access token or refresh token is missing",
            });
            return;
          }

          set({ isLoading: true, error: null });

          try {
            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (error) throw error;

            if (data.session) {
              // if user verifies after forget password
              if (type === 'recovery') {

                const { data: userData, error } =
                  await supabase.from("profiles").select("*")
                    .eq("id", data.session.user.id).single();

                if (error) throw error;

                set({
                  user: {
                    id: data.session.user.id,
                    email: data.session.user.email!,
                    username: userData?.username,
                    lastName: userData?.last_name,
                    firstName: userData?.first_name,
                    avatar: userData?.avatar_url,
                    fullName: userData?.first_name + " " + userData?.last_name,
                  },
                  //force him to update password
                  verificationStatus: "RESET_PASSWORD",
                });
                await syncOrchestrator.syncAll(data.session.user.id);
                await useAppSettingsStore.getState().setDefaultCurrency();
              } else {
                // if user verifies email after signup
                set({
                  verificationStatus: "VERIFIED",
                  user: {
                    ...get().user,
                    id: data.session.user.id,
                    email: data.session.user.email!,
                  },
                });
                Toast.show({
                  type: "success",
                  text1: "Success",
                  text2: "Email VERIFIED successfully!",
                });
                await syncOrchestrator.syncAll(data.session.user.id);
                await useAppSettingsStore.getState().setDefaultCurrency();
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
        // Forgot password action
        forgotPassword: async (email) => {
          set({ isLoading: true, error: null });
          try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: DEEP_LINKS.VERIFY_EMAIL,
            });
            if (error) throw error;
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Password reset link sent successfully!",
            });
          } catch (error: any) {
            set({ isLoading: false });
            Toast.show({
              type: "error",
              text1: "Error",
              text2: error.message || 'Failed to send password reset link',
            });
          }
          finally {
            set({ isLoading: false });
          }
        },
        // Reset password action
        changePassword: async ({ password }) => {
          set({ isLoading: true, error: null });
          try {
            const { error, data } = await supabase.auth.updateUser({
              password,
            });
            if (error) throw error;

            const { data: userData, error: userError } =
              await supabase.from("profiles").select("*")
                .eq("id", data.user.id).single();

            if (userError) throw userError;

            set({
              user: {
                id: data.user.id,
                email: data.user.email!,
                username: userData?.username,
                lastName: userData?.last_name,
                firstName: userData?.first_name,
                avatar: userData?.avatar_url,
                fullName: userData?.first_name + " " + userData?.last_name,
              },
              verificationStatus: "VERIFIED",
            });

            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Password changed successfully!",
            });
          } catch (error: any) {
            set({ isLoading: false });
            Toast.show({
              type: "error",
              text1: "Error",
              text2: error.message || 'Failed to change password',
            });
          }
          finally {
            set({ isLoading: false });
          }
        },
        reset: () => {
          set({
            user: null,
            verificationStatus: "SINGED_OUT",
            isLoading: false,
            error: null,
          });
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
              cleanupService.cleanupOnLogout();
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

      }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        user: state.user,
        verificationStatus: state.verificationStatus,
      }),
    }
  )
);
