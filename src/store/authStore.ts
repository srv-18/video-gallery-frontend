import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  userVideos: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      fetchUser: async () => {
        set({ isLoading: true });
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signin`
          );
          console.log(response.data);
          set({ user: response.data.user });
        } catch {
          set({ user: null });
        } finally {
          set({ isLoading: false });
        }
      },
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('jwt');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);