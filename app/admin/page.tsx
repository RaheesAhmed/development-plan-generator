"use client";

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
} from "lucide-react";

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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => downloadReport("monthly")}>
            <Download className="mr-2 h-4 w-4" />
            Monthly Report
          </Button>
          <Button variant="outline" onClick={() => downloadReport("analytics")}>
            <FileText className="mr-2 h-4 w-4" />
            Analytics Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
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

      <Tabs defaultValue="consultants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="consultants">Consultants</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="consultants">
          <Card>
            <CardHeader>
              <CardTitle>Consultant Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ConsultantsSection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Corporate Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <SubscriptionsSection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
            </CardHeader>
            <CardContent>{/* Add analytics visualizations */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>{/* Add settings form */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
