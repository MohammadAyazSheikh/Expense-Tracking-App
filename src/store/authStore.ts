import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../utils/storage';

interface User {
  id: string;
  email: string;
  name: string;
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
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  sendOTP: (email: string, type: 'signup' | 'forgot_password') => Promise<void>;
  verifyOTP: (email: string, code: string, type: 'signup' | 'forgot_password') => Promise<boolean>;
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
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // // Replace with your actual API call
          // const response = await fetch('YOUR_API_URL/auth/login', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ email, password }),
          // });

          // if (!response.ok) {
          //   throw new Error('Login failed');
          // }

          // const data = await response.json();

          set(data);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      // Register action
      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          // // Replace with your actual API call
          // const response =

          //   await fetch('YOUR_API_URL/auth/register', {
          //     method: 'POST',
          //     headers: { 'Content-Type': 'application/json' },
          //     body: JSON.stringify({ email, password, name }),
          //   });

          // if (!response.ok) {
          //   throw new Error('Registration failed');
          // }

          // const data = await response.json();

          set(data);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
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

      verifyOTP: async (email: string, code: string, type: 'signup' | 'forgot_password') => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          if (code === "123456") {
            if (type === 'signup') {
              // Mock successful signup login
              const mockUser: User = {
                id: "123",
                email: email,
                name: "New User",
              };
              set({
                user: mockUser,
                token: "mock-jwt-token",
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              set({ isLoading: false });
            }
            return true;
          } else {
            throw new Error("Invalid OTP");
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Invalid OTP",
            isLoading: false,
          });
          throw error;
        }
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
