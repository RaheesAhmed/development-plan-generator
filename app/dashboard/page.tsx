"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  Bell,
  ChevronRight,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { AssessmentData, DevelopmentPlan } from "@/types/types";
import { PlanDisplay } from "@/components/PlanDisplay";
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
        storedPlan.replace('"', " ");
        console.log("storedPlan:", storedPlan);
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

  const renderContent = () => {
    switch (activeSection) {
      case "development-plans":
        return (
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Your Development Plan
                </h2>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    disabled={isLoading}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <div
                id="development-plan-content"
                className="prose prose-slate max-w-none
                  prose-headings:font-semibold 
                  prose-h1:text-3xl prose-h1:mb-8
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-li:text-slate-600
                  prose-strong:text-slate-900
                  prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline"
              >
                {developmentPlan ? (
                  <PlanDisplay plan={developmentPlan.content} />
                ) : (
                  <div className="text-center py-12">
                    <BrainCircuit className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">
                      No development plan available yet.
                    </p>
                    <Link href="/start">
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        Complete Assessment
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  {getStatusBadge(assessmentData.status)}
                </div>
                <h3 className="text-sm font-medium text-slate-500">Status</h3>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {assessmentData.status === "completed"
                    ? "Complete"
                    : "In Progress"}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Clock className="h-5 w-5 text-indigo-500" />
                  </div>
                  <span className="text-sm text-slate-500">
                    {new Date(assessmentData.completedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-slate-500">
                  Time Invested
                </h3>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {Math.floor(assessmentData.timeSpent / 60)}m
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Target className="h-5 w-5 text-purple-500" />
                  </div>
                  <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    Level {assessmentData.responsibilityLevel.role}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-slate-500">
                  Leadership Level
                </h3>
                <p className="text-lg font-medium text-slate-900 mt-1">
                  {assessmentData.responsibilityLevel.title}
                </p>
              </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-slate-100/80 p-1 rounded-xl">
                <TabsTrigger value="overview" className="rounded-lg">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="development-plan" className="rounded-lg">
                  Development Plan
                </TabsTrigger>
                <TabsTrigger value="detailed-results" className="rounded-lg">
                  Results
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-6">
                    Assessment Overview
                  </h2>

                  <div className="space-y-6">
                    {/* Progress Section */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">
                          Progress
                        </span>
                        <span className="text-sm font-medium text-slate-900">
                          {Math.round(calculateProgress())}%
                        </span>
                      </div>
                      <Progress value={calculateProgress()} className="h-2" />
                    </div>

                    {/* Strengths and Improvements Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">
                          Key Strengths
                        </h3>
                        <div className="space-y-3">
                          {[
                            "Strategic Thinking",
                            "Team Leadership",
                            "Communication",
                          ].map((strength) => (
                            <div
                              key={strength}
                              className="flex items-center gap-3 bg-green-50 p-3 rounded-lg"
                            >
                              <Star className="h-5 w-5 text-green-500" />
                              <span className="text-slate-700">{strength}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">
                          Growth Areas
                        </h3>
                        <div className="space-y-3">
                          {[
                            "Conflict Resolution",
                            "Time Management",
                            "Delegation",
                          ].map((area) => (
                            <div
                              key={area}
                              className="flex items-center gap-3 bg-indigo-50 p-3 rounded-lg"
                            >
                              <ChevronRight className="h-5 w-5 text-indigo-500" />
                              <span className="text-slate-700">{area}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="development-plan">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Development Plan
                    </h2>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        disabled={isLoading}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Download PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-600 hover:text-slate-900"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  <div
                    id="development-plan-content"
                    className="prose max-w-none"
                  >
                    {developmentPlan ? (
                      <PlanDisplay plan={developmentPlan.content} />
                    ) : (
                      <p className="text-slate-600">
                        No development plan available yet.
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="detailed-results">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-6">
                    Detailed Results
                  </h2>
                  {/* Add your detailed results content here */}
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Button */}
            <div className="mt-8 flex justify-center">
              <Button
                className={`${brandColors.primary} ${brandColors.hover} text-white px-8`}
              >
                Start Next Assessment
              </Button>
            </div>
          </div>
        );
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
  const brandColors = {
    primary: "bg-indigo-600",
    secondary: "bg-purple-600",
    accent: "bg-cyan-500",
    hover: "hover:bg-indigo-700",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="p-8 rounded-2xl bg-white shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="text-xl font-medium text-slate-700">
              Loading your insights...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="p-8 rounded-2xl bg-white shadow-xl max-w-md w-full">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="p-4 rounded-full bg-indigo-50">
              <BarChart className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Start Your Leadership Journey
              </h2>
              <p className="text-slate-600 mb-6">
                Complete an assessment to view your personalized dashboard
              </p>
              <Link href="/start">
                <Button
                  className={`w-full ${brandColors.primary} ${brandColors.hover} text-white`}
                >
                  Begin Assessment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Modernized Sidebar */}
      <div className="w-72 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            LeaderPulse
          </h2>
        </div>
        <nav className="mt-6 px-3">
          {[
            { icon: Home, label: "Overview", value: "dashboard" },
            { icon: BarChart, label: "Assessments", value: "assessments" },
            {
              icon: BrainCircuit,
              label: "Development",
              value: "development-plans",
            },
            { icon: Settings, label: "Settings", value: "settings" },
            { icon: HelpCircle, label: "Support", value: "help" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveSection(item.value)}
              className={`w-full flex items-center px-4 py-3 mb-2 rounded-xl text-sm font-medium transition-all
                ${
                  activeSection === item.value
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-72 p-6"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Modern Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-900">
              Leadership Dashboard
            </h1>
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="icon" className="text-slate-600">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={assessmentData.userInfo.avatar}
                  alt={assessmentData.userInfo.name}
                />
                <AvatarFallback className="bg-indigo-100 text-indigo-600">
                  {assessmentData.userInfo.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
