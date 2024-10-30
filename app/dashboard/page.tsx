"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import {
  Loader2,
  CheckCircle,
  Clock,
  Target,
  BarChart,
  BrainCircuit,
  Download,
  Share2,
  Home,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface AssessmentData {
  responses: any[];
  completedAt: string;
  timeSpent: number;
  status: "pending" | "completed";
  userInfo: any;
  responsibilityLevel: any;
}

export default function EnhancedDashboardPage() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(
    null
  );
  const [developmentPlan, setDevelopmentPlan] = useState<string | null>(null);

  useEffect(() => {
    const loadData = () => {
      const storedAssessment = localStorage.getItem("assessmentResponses");
      const storedPlan = localStorage.getItem("developmentPlan");

      if (storedAssessment) {
        setAssessmentData(JSON.parse(storedAssessment));
      }
      if (storedPlan) {
        setDevelopmentPlan(storedPlan);
      }
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Processing</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  if (!assessmentData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="p-8 shadow-lg">
          <CardContent className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
            <p className="text-xl font-semibold text-gray-700">
              Loading your assessment data...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculateProgress = () => {
    return (assessmentData.responses.length / 10) * 100;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">LeaderPulse</h2>
        </div>
        <nav className="mt-8">
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-200"
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            <BarChart className="mr-3 h-5 w-5" />
            Assessments
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            <BrainCircuit className="mr-3 h-5 w-5" />
            Development Plans
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            <HelpCircle className="mr-3 h-5 w-5" />
            Help
          </a>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Your Leadership Journey Dashboard
          </h1>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Assessment Status
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getStatusBadge(assessmentData.status)}
                </div>
                <p className="text-xs text-gray-500">
                  Last updated:{" "}
                  {new Date(assessmentData.completedAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Time Invested
                </CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(assessmentData.timeSpent / 60)} minutes
                </div>
                <p className="text-xs text-gray-500">
                  Total assessment duration
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Leadership Level
                </CardTitle>
                <Target className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Level {assessmentData.responsibilityLevel.role}
                </div>
                <p className="text-xs text-gray-500">
                  {assessmentData.responsibilityLevel.title}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="development-plan">
                Development Plan
              </TabsTrigger>
              <TabsTrigger value="detailed-results">
                Detailed Results
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-medium">
                          {Math.round(calculateProgress())}%
                        </span>
                      </div>
                      <Progress
                        value={calculateProgress()}
                        className="w-full"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Key Strengths
                        </h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Strategic Thinking</li>
                          <li>Team Leadership</li>
                          <li>Communication Skills</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Areas for Improvement
                        </h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Conflict Resolution</li>
                          <li>Time Management</li>
                          <li>Delegation Skills</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="development-plan">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    Your Development Plan
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {developmentPlan ? (
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                      <ReactMarkdown className="prose max-w-none">
                        {developmentPlan}
                      </ReactMarkdown>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                      <p className="text-gray-600">
                        {assessmentData.status === "pending"
                          ? "Generating your personalized development plan..."
                          : "No plan available at this time. Please check back later."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="detailed-results">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Assessment Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      "Strategic Thinking",
                      "Team Leadership",
                      "Communication",
                      "Problem Solving",
                    ].map((category, index) => (
                      <div key={index}>
                        <h3 className="text-lg font-semibold mb-2">
                          {category}
                        </h3>
                        <div className="flex items-center">
                          <Progress
                            value={Math.random() * 100}
                            className="w-full mr-4"
                          />
                          <span className="text-sm font-medium">
                            {Math.round(Math.random() * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Start Next Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
