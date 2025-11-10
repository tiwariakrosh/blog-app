"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/theme-toggle";

export const Navbar = () => {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">B</span>
          </div>
          <span className="font-bold text-lg text-foreground">Blog</span>
        </Link>

        <nav className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.name.toLocaleUpperCase()}
            </span>
          )}

          <ThemeToggle />
          {user && (
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
