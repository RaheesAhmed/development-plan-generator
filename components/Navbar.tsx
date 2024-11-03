"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Here you would typically handle your authentication logic
    setIsLoggedIn(true);
    router.push("/dashboard");
  };

  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Leadership Assessment</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Button variant="ghost" onClick={handleLogin}>
                  Login
                </Button>
                <Button onClick={handleLogin}>Sign up</Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome,{" "}
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
