"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import DevelopmentPlanViewer from "@/components/plan_viewer";
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
  Link,
} from "lucide-react";
import html2pdf from "html2pdf.js";

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

import { DevelopmentPlan } from "@/types/development_plan";

const DashboardPage = () => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(
    null
  );
  const [developmentPlan, setDevelopmentPlan] = useState<{
    development_plan: DevelopmentPlan;
  } | null>(null);
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
        console.log(storedPlan);
        const cleanedPlan = storedPlan
          .replace("```json", " ")
          .replace("```", "");
        setDevelopmentPlan(JSON.parse(cleanedPlan));
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
          <a
            href="#"
            onClick={() => setActiveSection("dashboard")}
            className={`flex items-center px-4 py-2 text-gray-700 ${
              activeSection === "dashboard"
                ? "bg-gray-200"
                : "hover:bg-gray-200"
            }`}
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </a>
          <a
            href="#"
            onClick={() => setActiveSection("assessments")}
            className={`flex items-center px-4 py-2 text-gray-700 ${
              activeSection === "assessments"
                ? "bg-gray-200"
                : "hover:bg-gray-200"
            }`}
          >
            <BarChart className="mr-3 h-5 w-5" />
            Assessments
          </a>
          <a
            href="#"
            onClick={() => {
              setActiveSection("development-plans");
              // Also set the active tab to development-plan
              const tabsList = document.querySelector('[role="tablist"]');
              const developmentPlanTab = tabsList?.querySelector(
                '[value="development-plan"]'
              ) as HTMLButtonElement;
              if (developmentPlanTab) {
                developmentPlanTab.click();
              }
            }}
            className={`flex items-center px-4 py-2 text-gray-700 ${
              activeSection === "development-plans"
                ? "bg-gray-200"
                : "hover:bg-gray-200"
            }`}
          >
            <BrainCircuit className="mr-3 h-5 w-5" />
            Development Plans
          </a>
          <a
            href="#"
            onClick={() => setActiveSection("settings")}
            className={`flex items-center px-4 py-2 text-gray-700 ${
              activeSection === "settings" ? "bg-gray-200" : "hover:bg-gray-200"
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </a>
          <a
            href="#"
            onClick={() => setActiveSection("help")}
            className={`flex items-center px-4 py-2 text-gray-700 ${
              activeSection === "help" ? "bg-gray-200" : "hover:bg-gray-200"
            }`}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex-1 min-w-0">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Bell className="h-6 w-6" />
                </button>
                <div className="ml-3 relative">
                  <div>
                    <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <Avatar>
                        <AvatarImage
                          src={assessmentData.userInfo.avatar}
                          alt={assessmentData.userInfo.name}
                        />
                        <AvatarFallback>
                          {assessmentData.userInfo.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="ml-2 hidden md:inline-block">
                        {assessmentData.userInfo.name}
                      </span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                      <div id="development-plan-content">
                        <DevelopmentPlanViewer
                          {...developmentPlan.development_plan}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-4 py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <p className="text-gray-600">
                          {assessmentData?.status === "pending"
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
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
