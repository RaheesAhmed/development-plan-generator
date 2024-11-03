"use client";

import { useAuth } from "@/lib/contexts/auth-context";
import AdminNavbar from "./AdminNavbar";
import UserNavbar from "./UserNavbar";
import PublicNavbar from "./PublicNavbar";
import { usePathname } from "next/navigation";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: "admin" | "user";
}

export default function NavbarWrapper() {
  const { user } = useAuth();
  const pathname = usePathname();
  const userWithRole = user as User | null;

  // Check if we're in the admin section
  const isAdminRoute = pathname?.startsWith("/admin");

  // If we're in admin route but user is not admin, they shouldn't be there
  if (isAdminRoute && userWithRole?.role !== "admin") {
    // You might want to redirect here or show an error
    window.location.href = "/"; // Simple redirect
    return null;
  }

  // If no user is logged in, show public navbar
  if (!userWithRole) {
    return <PublicNavbar />;
  }

  // Show admin navbar for admin users in admin routes
  if (userWithRole.role === "admin" && isAdminRoute) {
    return <AdminNavbar />;
  }

  // Show user navbar for regular users or admins in non-admin routes
  return <UserNavbar />;
}
