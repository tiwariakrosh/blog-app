"use client";

import type React from "react";
// import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { Navbar } from "@/components/navbar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";

// export const metadata: Metadata = {
//   title: "Blog Platform - Create & Share Stories",
//   description: "A modern blog platform built with Next.js, Zustand, and Tiptap",
// };

function AuthInitializer() {
  useAuth();
  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="min-h-screen bg-background">
          <AuthInitializer />
          <ThemeProvider>
            <Navbar />
            <main>{children}</main>
            <div className="fixed bottom-4 right-4">
              <ThemeToggle />
            </div>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
