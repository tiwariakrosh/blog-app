
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export const useAuth = () => {
  const { user, token, isLoading, checkAuth, login, register, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
  };
};