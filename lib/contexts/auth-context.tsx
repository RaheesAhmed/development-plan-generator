"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await fetch("/api/auth/user", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);

          // Handle redirects for authenticated users
          if (["/", "/sign-in", "/sign-up"].includes(pathname)) {
            const redirectPath = data.user.isAdmin ? "/admin" : "/dashboard";
            router.replace(redirectPath);
          }
        } else {
          setUser(null);
          // Handle redirects for unauthenticated users
          if (
            pathname !== "/sign-in" &&
            pathname !== "/sign-up" &&
            pathname !== "/"
          ) {
            router.replace("/sign-in");
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [router, pathname]);

  const login = async (userData: User) => {
    setUser(userData);
    const redirectPath = userData.isAdmin ? "/admin" : "/dashboard";
    await router.replace(redirectPath);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Clear local storage
      localStorage.removeItem("token");

      setUser(null);
      await router.replace("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
