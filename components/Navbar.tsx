"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogin = () => {
    router.push("/sign-in");
  };

  const handleSignup = () => {
    router.push("/sign-up");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">CareerPro</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Button variant="ghost" onClick={handleLogin}>
                  Login
                </Button>
                <Button onClick={handleSignup}>Sign up</Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.name || user.email}
                </span>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
