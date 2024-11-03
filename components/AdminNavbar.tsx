"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Database,
  FileText,
  Activity,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminNavbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center space-x-2">
              <LayoutDashboard className="h-6 w-6 text-indigo-400" />
              <span className="font-bold text-xl">Admin Portal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/admin/users"
              className="px-3 py-2 rounded-md hover:bg-gray-800 transition flex items-center space-x-2"
            >
              <Users className="h-5 w-5 text-indigo-400" />
              <span>Users</span>
            </Link>
            <Link
              href="/admin/analytics"
              className="px-3 py-2 rounded-md hover:bg-gray-800 transition flex items-center space-x-2"
            >
              <Activity className="h-5 w-5 text-indigo-400" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/admin/database"
              className="px-3 py-2 rounded-md hover:bg-gray-800 transition flex items-center space-x-2"
            >
              <Database className="h-5 w-5 text-indigo-400" />
              <span>Database</span>
            </Link>
            <Link
              href="/admin/reports"
              className="px-3 py-2 rounded-md hover:bg-gray-800 transition flex items-center space-x-2"
            >
              <FileText className="h-5 w-5 text-indigo-400" />
              <span>Reports</span>
            </Link>
            <Link
              href="/admin/settings"
              className="px-3 py-2 rounded-md hover:bg-gray-800 transition flex items-center space-x-2"
            >
              <Settings className="h-5 w-5 text-indigo-400" />
              <span>Settings</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:bg-gray-800">
                  <span className="mr-2">Admin</span>
                  {user?.name || user?.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-gray-800"
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
        <div className="md:hidden bg-gray-800 px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/admin/users"
            className="block px-3 py-2 rounded-md hover:bg-gray-700 transition"
          >
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-indigo-400" />
              <span>Users</span>
            </div>
          </Link>
          <Link
            href="/admin/analytics"
            className="block px-3 py-2 rounded-md hover:bg-gray-700 transition"
          >
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-indigo-400" />
              <span>Analytics</span>
            </div>
          </Link>
          <Link
            href="/admin/database"
            className="block px-3 py-2 rounded-md hover:bg-gray-700 transition"
          >
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-indigo-400" />
              <span>Database</span>
            </div>
          </Link>
          <Link
            href="/admin/reports"
            className="block px-3 py-2 rounded-md hover:bg-gray-700 transition"
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-indigo-400" />
              <span>Reports</span>
            </div>
          </Link>
          <Link
            href="/admin/settings"
            className="block px-3 py-2 rounded-md hover:bg-gray-700 transition"
          >
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-indigo-400" />
              <span>Settings</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-red-400 hover:bg-gray-700"
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      )}
    </nav>
  );
}
