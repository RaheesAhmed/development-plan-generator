"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function PublicNavbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-indigo-600">
                CareerPro
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition"
            >
              Login
            </Link>
            <Button
              onClick={() => router.push("/sign-up")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/sign-in"
            className="block px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 transition"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="block px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
