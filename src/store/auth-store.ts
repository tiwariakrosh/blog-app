
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; 
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const storedUser = localStorage.getItem(`user_${email}`);
        if (!storedUser) {
          set({ isLoading: false });
          const err = new Error("No account found with this email. Please register first.");
          throw err;
        }

        const user: User = JSON.parse(storedUser);
        if (user.password !== password) {
          set({ isLoading: false });
          const err = new Error("Incorrect password.");
          throw err;
        }

        const token = `token_${Date.now()}`;
        document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;

        // Remove password before storing in state
        const { password: _, ...safeUser } = user;
        set({ token, user: safeUser, isLoading: false });
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });

        await new Promise((resolve) => setTimeout(resolve, 800));

        const existingUser = localStorage.getItem(`user_${email}`);
        if (existingUser) {
          set({ isLoading: false });
          const err = new Error("An account with this email already exists.");
          throw err;
        }

        const user: User = {
          id: `user_${Date.now()}`,
          email,
          name,
          password,
        };

        localStorage.setItem(`user_${email}`, JSON.stringify(user));

        const token = `token_${Date.now()}`;
        document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;

        const { password: _, ...safeUser } = user;
        set({ token, user: safeUser, isLoading: false });
      },

      logout: () => {
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        set({ user: null, token: null, isLoading: false });
      },

      checkAuth: () => {
        if (typeof window === "undefined") return;

        const cookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth_token="))
          ?.split("=")[1];

        if (cookie && !get().token) {
          set({ token: cookie });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);