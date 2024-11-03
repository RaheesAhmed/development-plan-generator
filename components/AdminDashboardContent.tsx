"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  BarChart2,
  Settings,
  Bell,
  Search,
  Plus,
  MoreHorizontal,
  Calendar,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
  createdAt: string;
  demographics: {
    industry: string;
    companySize: string;
    department: string;
    jobTitle: string;
    // ... other demographic fields
  } | null;
  latestAssessment: {
    responsibilityLevel: any;
    createdAt: string;
    // ... other assessment fields
  } | null;
  status: "completed" | "pending";
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeView, setActiveView] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({
            title: "Error",
            description: "Please login to access the admin dashboard",
            variant: "destructive",
          });
          router.push("/login");
          return;
        }

        try {
          const tokenData = JSON.parse(atob(token.split(".")[1]));
          if (!tokenData.isAdmin) {
            toast({
              title: "Error",
              description: "You don't have admin privileges",
              variant: "destructive",
            });
            router.push("/");
            return;
          }
        } catch (error) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        fetchUsers();
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      router.push("/login");
    }
  }, [router]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        throw new Error(await response.text());
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "completed").length,
    completionRate: users.length
      ? Math.round(
          (users.filter((u) => u.status === "completed").length /
            users.length) *
            100
        )
      : 0,
    averageTime: "25min", // This would need to be calculated from actual assessment data
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            Admin Portal
          </h2>
        </div>

        <nav className="px-4 space-y-1">
          {[
            { icon: BarChart2, label: "Overview", value: "overview" },
            { icon: Users, label: "Users", value: "users" },
            { icon: Calendar, label: "Schedule", value: "schedule" },
            { icon: Settings, label: "Settings", value: "settings" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveView(item.value)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeView === item.value
                  ? "bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-10 w-64 bg-gray-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder-avatar.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  title: "Total Users",
                  value: stats.totalUsers,
                  change: "+12.3%",
                  trend: "up",
                },
                {
                  title: "Active Users",
                  value: stats.activeUsers,
                  change: "+8.1%",
                  trend: "up",
                },
                {
                  title: "Completion Rate",
                  value: `${stats.completionRate}%`,
                  change: "+5.4%",
                  trend: "up",
                },
                {
                  title: "Avg. Assessment Time",
                  value: stats.averageTime,
                  change: "-3.2%",
                  trend: "down",
                },
              ].map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <TrendingUp
                      className={`h-4 w-4 ${
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p
                      className={`text-sm ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Users List */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>
                      {filteredUsers.length} total users
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No users found
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {user.name?.[0] || user.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.name || "Anonymous"}
                              {user.isAdmin && (
                                <Badge variant="secondary" className="ml-2">
                                  Admin
                                </Badge>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                            {user.demographics && (
                              <p className="text-sm text-gray-500">
                                {user.demographics.jobTitle} -{" "}
                                {user.demographics.department}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge
                            variant={
                              user.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {user.status}
                          </Badge>
                          {user.latestAssessment && (
                            <div className="flex items-center space-x-2">
                              <Progress value={100} className="w-24" />
                              <span className="text-sm text-gray-500">
                                {new Date(
                                  user.latestAssessment.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                              {!user.isAdmin && (
                                <DropdownMenuItem>Make Admin</DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
