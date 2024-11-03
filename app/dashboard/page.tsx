"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import html2pdf from "html2pdf.js";
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
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

interface AssessmentData {
  responses: any[];
  completedAt: string;
  timeSpent: number;
  status: "pending" | "completed";
  userInfo: {
    name: string;
    email: string;
    avatar: string;
  };
  responsibilityLevel: {
    role: number;
    title: string;
  };
}

interface DevelopmentPlan {
  content: string;
  goals: {
    title: string;
    description: string;
    progress: number;
  }[];
  skills: {
    name: string;
    level: number;
    description: string;
  }[];
}

export default function DashboardPage() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(
    null
  );
  const [developmentPlan, setDevelopmentPlan] =
    useState<DevelopmentPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      const storedAssessment = localStorage.getItem("assessmentResponses");
      const storedPlan = localStorage.getItem("developmentPlan");

      if (storedAssessment) {
        setAssessmentData(JSON.parse(storedAssessment));
      }
      if (storedPlan) {
        setDevelopmentPlan({
          content: storedPlan,
          goals: [],
          skills: [],
        });
      }
      setIsLoading(false);
    };

    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every minute
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

  const calculateProgress = () => {
    return ((assessmentData?.responses.length || 0) / 10) * 100;
  };

  const handleDownload = async () => {
    if (developmentPlan) {
      const element = document.getElementById("development-plan-content");

      if (element) {
        const opt = {
          margin: 1,
          filename: "development_plan.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };

        try {
          setIsLoading(true);
          await html2pdf().set(opt).from(element).save();
        } catch (error) {
          console.error("Error generating PDF:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="p-8 shadow-lg">
          <CardContent className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
            <p className="text-xl font-semibold text-gray-700">
              Loading your dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="p-8 shadow-lg">
          <CardContent className="flex flex-col items-center">
            <p className="text-xl font-semibold text-gray-700">
              No assessment data available. Please complete an assessment.
            </p>
            <Link href="/start">
              <Button className="mt-4">Start Assessment</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">LeaderPulse</h2>
        </div>
        <nav className="mt-8">
          {[
            { icon: Home, label: "Dashboard", value: "dashboard" },
            { icon: BarChart, label: "Assessments", value: "assessments" },
            {
              icon: BrainCircuit,
              label: "Development Plans",
              value: "development-plans",
            },
            { icon: Settings, label: "Settings", value: "settings" },
            { icon: HelpCircle, label: "Help", value: "help" },
          ].map((item) => (
            <a
              key={item.value}
              href="#"
              onClick={() => setActiveSection(item.value)}
              className={`flex items-center px-4 py-2 text-gray-700 ${
                activeSection === item.value
                  ? "bg-gray-200"
                  : "hover:bg-gray-200"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </a>
          ))}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Your Leadership Journey
            </h1>
            <div className="flex items-center space-x-4">
              <Input type="search" placeholder="Search..." className="w-64" />
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage
                  src={assessmentData.userInfo.avatar}
                  alt={assessmentData.userInfo.name}
                />
                <AvatarFallback>
                  {assessmentData.userInfo.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <p className="text-xs text-gray-500">
                    Assessment ID: {assessmentData.assessmentId}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="bg-white p-1 rounded-lg">
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
                          <ul className="space-y-1">
                            {[
                              "Strategic Thinking",
                              "Team Leadership",
                              "Communication Skills",
                            ].map((strength, index) => (
                              <li
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Areas for Improvement
                          </h3>
                          <ul className="space-y-1">
                            {[
                              "Conflict Resolution",
                              "Time Management",
                              "Delegation Skills",
                            ].map((area, index) => (
                              <li
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <ChevronRight className="h-4 w-4 text-blue-500" />
                                <span>{area}</span>
                              </li>
                            ))}
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownload}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          Download PDF
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
                      <div id="development-plan-content" className="space-y-6">
                        <div className="prose max-w-none">
                          <MarkdownRenderer content={developmentPlan.content} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Development Goals
                          </h3>
                          <div className="grid gap-4 md:grid-cols-2"></div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Skill Development
                          </h3>
                          <div className="grid gap-4 md:grid-cols-2"></div>
                        </div>
                      </div>
                    ) : (
                      <p>No development plan available.</p>
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
                    <div className="space-y-6"></div>
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
        </main>
      </div>
    </div>
  );
}
