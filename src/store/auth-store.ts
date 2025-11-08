
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
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
        try {
          const response = await new Promise<{ token: string; user: User }>((resolve) => {
            setTimeout(() => {
              resolve({
                token: `token_${Date.now()}`,
                user: {
                  id: `user_${Date.now()}`,
                  email,
                  name: email.split("@")[0],
                },
              });
            }, 800);
          });

          const { token, user } = response;

          document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;

          set({ token, user, isLoading: false });
        } catch (err) {
          set({ error: "Login failed", isLoading: false });
          throw err;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 800));
          const token = `token_${Date.now()}`;
          const user: User = { id: `user_${Date.now()}`, email, name };

          document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;

          set({ token, user, isLoading: false });
        } catch (err) {
          set({ error: "Registration failed", isLoading: false });
          throw err;
        }
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
      onRehydrateStorage: () => {
        console.warn("Auth rehydration failed");
      },
    }
  )
);