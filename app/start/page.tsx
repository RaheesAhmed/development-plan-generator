"use client";

import { useState, useEffect } from "react";
import DemographicForm from "@/components/DemographicForm";
import GetAllQuestionByLevel from "@/components/GetAllQuestionByLevel";
import KnowMoreAboutAssesment from "@/components/KnowMoreAboutAssesment";
import { DemographicQuestions } from "@/utils/demographic_questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Question } from "@/types/assessment";
import { toast } from "@/hooks/use-toast";
import { AssessmentResponse } from "@/types/assessment";
import ReactMarkdown from "react-markdown";

interface ResponsibilityLevel {
  role: string;
  level: number;
  description: string;
}

interface MultiRaterData {
  raterEmail: string;
  relationship: string;
  completed: boolean;
}

interface FormData {
  [key: string]: string;
  name: string;
  industry: string;
  companySize: string;
  department: string;
  jobTitle: string;
  directReports: string;
  decisionLevel: string;
  typicalProject: string;
  levelsToCEO: string;
  managesBudget: string;
}

interface ClassifyResponse {
  success: boolean;
  data: {
    responsibilityLevel: number;
    role: string;
    description: string;
    versionInfo: {
      "v1.0": string;
      "v2.0": string;
    };
    nextStep: string;
  };
}

interface FormattedResponsibilityLevel {
  level: number;
  role: string;
  description: string;
}

export default function StartPage() {
  const [stage, setStage] = useState<string>("demographic");
  const [responsibilityLevel, setResponsibilityLevel] =
    useState<ResponsibilityLevel | null>(null);
  const [userInfo, setUserInfo] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [raters, setRaters] = useState<MultiRaterData[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const loadedQuestions = await DemographicQuestions();
        setQuestions(loadedQuestions as Question[]);
      } catch (error) {
        console.error("Error loading questions:", error);
        setError(
          "Failed to load demographic questions. Please try again later."
        );
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, []);

  const handleDemographicSubmit = async (formData: FormData) => {
    try {
      const response = await fetch(`/api/assessment/classify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          industry: formData.industry,
          companySize: formData.companySize,
          department: formData.department,
          jobTitle: formData.jobTitle,
          directReports: formData.directReports,
          decisionLevel: formData.decisionLevel,
          typicalProject: formData.typicalProject,
          levelsToCEO: formData.levelsToCEO,
          managesBudget: formData.managesBudget === "yes",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to classify responsibility level");
      }

      const data: ClassifyResponse = await response.json();

      const formattedLevel: FormattedResponsibilityLevel = {
        level: data.data.responsibilityLevel,
        role: data.data.role,
        description: data.data.description,
      };

      setResponsibilityLevel(formattedLevel);
      setUserInfo(formData);
      setStage("assessmentOptions");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to classify responsibility level",
      });
    }
  };

  const handleAssessmentComplete = async (
    answers: AssessmentResponse[]
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/assessment/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInfo,
          responsibilityLevel,
          assessmentAnswers: answers,
          assessmentCompleted: true,
        }),
      });

      const data = await response.json();

      if (data.success && data.plan) {
        localStorage.setItem("developmentPlan", data.plan);

        const storedAssessment = localStorage.getItem("assessmentResponses");
        if (storedAssessment) {
          const updatedAssessment = {
            ...JSON.parse(storedAssessment),
            status: "completed",
          };
          localStorage.setItem(
            "assessmentResponses",
            JSON.stringify(updatedAssessment)
          );
        }

        setGeneratedPlan(data.plan);
        router.push("/dashboard");
      } else {
        throw new Error(data.error || "Failed to generate plan");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate development plan",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipAssessment = async () => {
    if (!userInfo || !responsibilityLevel) {
      console.error("User info or responsibility level is missing");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/assessment/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInfo,
          responsibilityLevel,
          assessmentCompleted: false,
        }),
      });
      const data = await response.json();
      if (data.success && data.plan) {
        setGeneratedPlan(data.plan);
        setStage("planGenerated");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToDashboard = () => {
    // Store the generated plan in localStorage before navigating
    if (generatedPlan) {
      localStorage.setItem("developmentPlan", generatedPlan);
    }
    router.push("/dashboard");
  };

  const handleInputChange = (id: string, value: string) => {
    setUserInfo((prev) => {
      const updatedInfo: FormData = {
        name: "",
        industry: "",
        companySize: "",
        department: "",
        jobTitle: "",
        directReports: "",
        decisionLevel: "",
        typicalProject: "",
        levelsToCEO: "",
        managesBudget: "",
        ...(prev || {}),
        [id]: value,
      };
      return updatedInfo;
    });
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const validateStep = () => {
    if (!questions[currentStep]) return true;
    const value = userInfo?.[questions[currentStep].id];
    let isValid = true;
    let errorMessage = "";

    if (!value) {
      isValid = false;
      errorMessage = "This field is required";
    }

    setErrors((prev) => ({
      ...prev,
      [questions[currentStep].id]: errorMessage,
    }));
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, questions.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStage = () => {
    switch (stage) {
      case "demographic":
        if (error) {
          return (
            <Card className="max-w-md mx-auto mt-8">
              <CardContent className="flex flex-col items-center p-6">
                <div className="text-destructive mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-2 mx-auto"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          );
        }

        if (isLoadingQuestions) {
          return (
            <Card className="max-w-md mx-auto mt-8">
              <CardContent className="flex flex-col items-center p-6">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>Loading questions...</p>
              </CardContent>
            </Card>
          );
        }

        return (
          <DemographicForm
            questions={questions}
            userInfo={
              userInfo || {
                name: "",
                industry: "",
                companySize: "",
                department: "",
                jobTitle: "",
                directReports: "",
                decisionLevel: "",
                typicalProject: "",
                levelsToCEO: "",
                managesBudget: "",
              }
            }
            currentStep={currentStep}
            handleInputChange={handleInputChange}
            errors={errors}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleDemographicSubmit={handleDemographicSubmit}
          />
        );
      case "assessmentOptions":
        return (
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle>Assessment Options</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <Button onClick={() => setStage("assessmentChoices")}>
                Start Assessment
              </Button>
              <Button
                variant="outline"
                onClick={() => setStage("skipAssessment")}
              >
                Skip Assessment
              </Button>
            </CardContent>
          </Card>
        );
      case "assessmentChoices":
        return (
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle>Choose an Option</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <Button onClick={() => setStage("levelOneQuestions")}>
                Start Now
              </Button>
              <Button variant="outline" onClick={() => setStage("knowMore")}>
                Know More
              </Button>
            </CardContent>
          </Card>
        );
      case "levelOneQuestions":
        return responsibilityLevel ? (
          <div>
            <GetAllQuestionByLevel
              level={responsibilityLevel.level}
              userInfo={userInfo}
              responsibilityLevel={responsibilityLevel}
              onComplete={handleAssessmentComplete}
              isLoading={isLoading}
            />
            {isLoading && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <Card className="w-[300px]">
                  <CardContent className="flex flex-col items-center p-6">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p>Generating your development plan...</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : null;
      case "knowMore":
        return responsibilityLevel ? (
          <KnowMoreAboutAssesment level={responsibilityLevel.level} />
        ) : null;
      case "skipAssessment":
        return (
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle>Skipping Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                You've chosen to skip the assessment. We'll generate a
                development plan based on your profile information.
              </p>
              <Button
                onClick={handleSkipAssessment}
                className="mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Plan"
                )}
              </Button>
            </CardContent>
          </Card>
        );
      case "planGenerated":
        return (
          <Card className="max-w-3xl mx-auto mt-8">
            <CardHeader>
              <CardTitle>Your Development Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Based on your{" "}
                {responsibilityLevel ? "assessment results" : "profile"}, we've
                generated the following development plan:
              </p>
              <div className="mt-4 p-6 bg-gray-100 rounded-md overflow-auto max-h-[60vh]">
                {generatedPlan ? (
                  <ReactMarkdown className="prose prose-sm max-w-none">
                    {generatedPlan}
                  </ReactMarkdown>
                ) : (
                  <p>No plan generated yet.</p>
                )}
              </div>
              <div className="mt-6 flex justify-between">
                <Button onClick={navigateToDashboard}>View in Dashboard</Button>
                <Button variant="outline" onClick={() => window.print()}>
                  Print Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  const exportAssessmentData = async () => {
    // Add export functionality for consultants/companies
  };

  const generateAggregateReport = async () => {
    // Add reporting functionality for organizational insights
  };

  return <div className="container mx-auto px-4 py-8">{renderStage()}</div>;
}
