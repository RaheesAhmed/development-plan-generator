"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";
import { Home, User, BarChart, Book, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserNavbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

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
              href="/dashboard"
              className="px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 transition"
            >
              <div className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </div>
            </Link>
            <Link
              href="/profile"
              className="px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 transition"
            >
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </div>
            </Link>
            <Link
              href="/assessments"
              className="px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 transition"
            >
              <div className="flex items-center space-x-2">
                <BarChart className="h-5 w-5" />
                <span>Assessments</span>
              </div>
            </Link>
            <Link
              href="/resources"
              className="px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 transition"
            >
              <div className="flex items-center space-x-2">
                <Book className="h-5 w-5" />
                <span>Resources</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-700 hover:text-indigo-600"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Logout</span>
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
            href="/dashboard"
            className="block px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 transition"
          >
            <div className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link
            href="/profile"
            className="block px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 transition"
          >
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </div>
          </Link>
          <Link
            href="/assessments"
            className="block px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 transition"
          >
            <div className="flex items-center space-x-2">
              <BarChart className="h-5 w-5" />
              <span>Assessments</span>
            </div>
          </Link>
          <Link
            href="/resources"
            className="block px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 transition"
          >
            <div className="flex items-center space-x-2">
              <Book className="h-5 w-5" />
              <span>Resources</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-gray-700 hover:text-indigo-600"
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      )}
    </nav>
  );
}
