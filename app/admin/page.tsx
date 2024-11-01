"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building,
  Briefcase,
  Activity,
  Settings,
  Download,
  FileText,
  BarChart,
  Loader2,
  Search,
  ChevronsUpDown,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface ConsultantData {
  id: string;
  name: string;
  company: string;
  revenueShare: number;
  clients: any[];
}

interface SubscriptionData {
  id: string;
  company: {
    name: string;
    domain: string;
  };
  plan: string;
  maxUsers: number;
  apiAccess: boolean;
  analyticsAccess: boolean;
}

interface AnalyticsData {
  totalAssessments: number;
  completionRate: number;
  averageScores: Record<string, number>;
  topDevelopmentAreas: string[];
}

export default function AdminDashboard() {
  const [consultants, setConsultants] = useState<ConsultantData[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const ConsultantsSection = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => fetchData()}
            className="mx-auto"
          >
            Retry
          </Button>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Revenue Share</TableHead>
            <TableHead>Clients</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No consultants found
              </TableCell>
            </TableRow>
          ) : (
            consultants.map((consultant) => (
              <TableRow key={consultant.id}>
                <TableCell>{consultant.name}</TableCell>
                <TableCell>{consultant.company}</TableCell>
                <TableCell>{consultant.revenueShare * 100}%</TableCell>
                <TableCell>{consultant.clients?.length || 0}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  };

  const SubscriptionsSection = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => fetchData()}
            className="mx-auto"
          >
            Retry
          </Button>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>API Access</TableHead>
            <TableHead>Analytics</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No subscriptions found
              </TableCell>
            </TableRow>
          ) : (
            subscriptions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{sub.company.name}</TableCell>
                <TableCell>
                  <Badge>{sub.plan}</Badge>
                </TableCell>
                <TableCell>{sub.maxUsers}</TableCell>
                <TableCell>
                  {sub.apiAccess ? (
                    <Badge variant="default" className="bg-green-500">
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Disabled</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {sub.analyticsAccess ? (
                    <Badge variant="default" className="bg-green-500">
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Disabled</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch consultants
      const consultantsRes = await fetch("/api/consultants");
      if (!consultantsRes.ok) throw new Error("Failed to fetch consultants");
      const consultantsData = await consultantsRes.json();
      setConsultants(consultantsData.data || []);

      // Fetch subscriptions
      const subscriptionsRes = await fetch("/api/corporate/subscriptions");
      if (!subscriptionsRes.ok)
        throw new Error("Failed to fetch subscriptions");
      const subscriptionsData = await subscriptionsRes.json();
      setSubscriptions(subscriptionsData.data || []);

      // Fetch analytics
      const analyticsRes = await fetch("/api/analytics/reports?type=summary");
      if (!analyticsRes.ok) throw new Error("Failed to fetch analytics");
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadReport = async (reportType: string) => {
    try {
      const response = await fetch(`/api/analytics/reports?type=${reportType}`);
      const data = await response.json();

      // Convert to CSV or PDF and trigger download
      // Implementation depends on your preferred format
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Building className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Admin Dashboard</span>
                    <span className="text-xs text-muted-foreground">
                      v1.0.0
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarGroup className="py-0">
              <SidebarGroupContent className="relative">
                <Input placeholder="Search..." className="pl-8" />
                <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeTab === "dashboard"}
                      onClick={() => setActiveTab("dashboard")}
                    >
                      <a href="#dashboard">
                        <BarChart className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeTab === "consultants"}
                      onClick={() => setActiveTab("consultants")}
                    >
                      <a href="#consultants">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Consultants</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeTab === "subscriptions"}
                      onClick={() => setActiveTab("subscriptions")}
                    >
                      <a href="#subscriptions">
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>Subscriptions</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeTab === "analytics"}
                      onClick={() => setActiveTab("analytics")}
                    >
                      <a href="#analytics">
                        <Activity className="mr-2 h-4 w-4" />
                        <span>Analytics</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeTab === "settings"}
                      onClick={() => setActiveTab("settings")}
                    >
                      <a href="#settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex items-center text-lg font-semibold">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </div>
            <div className="ml-auto flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => downloadReport("monthly")}
              >
                <Download className="mr-2 h-4 w-4" />
                Monthly Report
              </Button>
              <Button
                variant="outline"
                onClick={() => downloadReport("analytics")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Analytics Export
              </Button>
            </div>
          </header>
          <main className="p-6">
            {activeTab === "dashboard" && (
              <>
                <div className="grid gap-4 md:grid-cols-4 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Users
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {analytics?.totalAssessments || 0}
                      </div>
                    </CardContent>
                  </Card>
                  {/* Add more summary cards */}
                </div>
                {/* Add more dashboard content */}
              </>
            )}
            {activeTab === "consultants" && (
              <Card>
                <CardHeader>
                  <CardTitle>Consultant Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <ConsultantsSection />
                </CardContent>
              </Card>
            )}
            {activeTab === "subscriptions" && (
              <Card>
                <CardHeader>
                  <CardTitle>Corporate Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <SubscriptionsSection />
                </CardContent>
              </Card>
            )}
            {activeTab === "analytics" && (
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                </CardHeader>
                <CardContent>{/* Add analytics visualizations */}</CardContent>
              </Card>
            )}
            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                </CardHeader>
                <CardContent>{/* Add settings form */}</CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
