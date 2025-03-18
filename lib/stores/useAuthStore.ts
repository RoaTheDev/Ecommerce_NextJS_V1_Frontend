import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CurrentUserResponse, UserResponse } from '@/lib/types/authTypes';
import { logout, me } from "@/lib/api/authApi";

interface AuthState {
    currentUser: { customerId: string; displayName: string; email: string } | null;
    isAuthenticated: boolean;
    login: (userData: UserResponse) => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            currentUser: null,
            isAuthenticated: false,

            login: (userData: UserResponse) => {
                set({
                    currentUser: {
                        customerId: userData.customerId,
                        displayName: userData.displayName,
                        email: userData.email,
                    },
                    isAuthenticated: true,
                });
            },

            logout: async () => {
                try {
                    await logout();
                    set({ currentUser: null, isAuthenticated: false });
                    return;
                } catch (error) {
                    console.error('Error during logout:', error);
                    set({ currentUser: null, isAuthenticated: false });
                    throw error;
                }
            },

            checkAuth: async () => {
                try {
                    const userData: CurrentUserResponse = await me();
                    set({
                        currentUser: {
                            customerId: userData.customerId.toString(),
                            displayName: userData.displayName,
                            email: userData.email,
                        },
                        isAuthenticated: true,
                    });
                    return true;
                } catch (error) {
                    console.error('Auth check failed:', error);
                    set({ currentUser: null, isAuthenticated: false });
                    return false;
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ currentUser: state.currentUser }),
        }
    )
);