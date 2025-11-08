'use client';

import { useThemeStore } from '@/store/theme-store';
import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;

    // Remove both classes first to avoid conflicts
    root.classList.remove('light', 'dark');

    // Add the correct theme class
    root.classList.add(theme);
  }, [theme]);
  
  return children;
}