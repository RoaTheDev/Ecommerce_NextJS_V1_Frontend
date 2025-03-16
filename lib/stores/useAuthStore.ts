import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {jwtDecode} from 'jwt-decode';
import {UserResponse} from '@/lib/types/authTypes';

interface AuthState {
    currentUser: UserResponse | null;
    isAuthenticated: boolean;
    login: (userData: UserResponse) => void;
    logout: () => void;
    checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            currentUser: null,
            isAuthenticated: false,

            login: (userData: UserResponse) => {
                set({currentUser: userData, isAuthenticated: true});
            },

            logout: () => {
                set({currentUser: null, isAuthenticated: false});
            },

            checkAuth: () => {
                const {currentUser} = get();
                if (!currentUser) return false;

                try {
                    const decodedToken = jwtDecode<{ exp: number }>(currentUser.token.token);
                    const currentTime = Date.now() / 1000;

                    if (decodedToken.exp > currentTime) {
                        return true;
                    } else {
                        get().logout();
                        return false;
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                    get().logout();
                    return false;
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            // Only persist these keys
            partialize: (state) => ({currentUser: state.currentUser}),
        }
    )
);