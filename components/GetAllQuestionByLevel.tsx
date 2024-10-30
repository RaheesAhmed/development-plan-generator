"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Clock,
  Star,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  ratingQuestion: string;
  reflection: string;
  ratingDescription?: string;
  reflectionDescription?: string;
}

interface AreaData {
  area: string;
  questions: Question[];
}

interface AssessmentResponse {
  questionId: string;
  rating: number;
  response: string;
  reflectionRating: number;
  reflection: string;
  question: {
    ratingQuestion: string;
    reflection: string;
  };
  area: string;
}

interface Responses {
  [key: string]: string | number;
}

interface GetAllQuestionByLevelProps {
  level: number;
  userInfo: any;
  responsibilityLevel: any;
  onComplete: (answers: AssessmentResponse[]) => void;
  isLoading: boolean;
}

export default function GetAllQuestionByLevel({
  level,
  userInfo,
  responsibilityLevel,
  onComplete,
  isLoading,
}: GetAllQuestionByLevelProps) {
  const [assessmentData, setAssessmentData] = useState<AreaData[] | null>(null);
  const [currentArea, setCurrentArea] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Responses>({});
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/assessment/questions/${level}`);
        const data = await response.json();
        setAssessmentData(data.assessmentQuestionsByLevel);
      } catch (error) {
        console.error("Error fetching assessment data:", error);
        toast({
          title: "Error",
          description: "Failed to load assessment questions. Please try again.",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setResponses((prev) => ({
      ...prev,
      [`${currentArea}-${currentQuestion}-${field}`]: value,
    }));
  };

  const formatResponsesForSubmission = (): AssessmentResponse[] => {
    if (!assessmentData) return [];

    return assessmentData.flatMap((area, areaIndex) =>
      area.questions.map((question, questionIndex) => ({
        rating: Number(responses[`${areaIndex}-${questionIndex}-rating`]) || 0,
        response:
          (responses[`${areaIndex}-${questionIndex}-response`] as string) || "",
        reflectionRating:
          Number(responses[`${areaIndex}-${questionIndex}-reflectionRating`]) ||
          0,
        reflection:
          (responses[`${areaIndex}-${questionIndex}-reflection`] as string) ||
          "",
        question: {
          ratingQuestion: question.ratingQuestion,
          reflection: question.reflection,
        },
        area: area.area,
      }))
    );
  };

  const handleSubmitAssessment = async () => {
    try {
      const formattedResponses = formatResponsesForSubmission();

      // Save assessment responses to localStorage
      localStorage.setItem(
        "assessmentResponses",
        JSON.stringify({
          responses: formattedResponses,
          completedAt: new Date().toISOString(),
          timeSpent: 3600 - timeRemaining,
          status: "pending",
          userInfo,
          responsibilityLevel,
        })
      );

      // Call the onComplete callback with the formatted responses
      await onComplete(formattedResponses);

      toast({
        title: "Assessment Submitted",
        description:
          "Your responses have been saved. Redirecting to dashboard...",
      });

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (!assessmentData) return;

    if (currentQuestion < assessmentData[currentArea].questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else if (currentArea < assessmentData.length - 1) {
      setCurrentArea((prev) => prev + 1);
      setCurrentQuestion(0);
    } else {
      handleSubmitAssessment();
    }
  };

  const handlePrevious = () => {
    if (!assessmentData) return;

    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    } else if (currentArea > 0) {
      setCurrentArea((prev) => prev - 1);
      setCurrentQuestion(assessmentData[currentArea - 1].questions.length - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const calculateProgress = () => {
    if (!assessmentData) return 0;
    const totalQuestions = assessmentData.reduce(
      (acc, area) => acc + area.questions.length,
      0
    );
    const answeredQuestions = Object.keys(responses).filter((key) =>
      key.endsWith("-rating")
    ).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  if (!assessmentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const handleSave = () => {
    console.log("Saving responses:", responses);
    toast({
      title: "Progress Saved",
      description: "Your responses have been saved successfully.",
    });
  };

  const currentAreaData = assessmentData[currentArea];
  const currentQuestionData = currentAreaData.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="bg-blue-600 text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold">
              Leadership Capability Assessment
            </CardTitle>
            <div className="flex items-center text-blue-100">
              <Clock className="w-5 h-5 mr-2" />
              <span className="text-lg">{formatTime(timeRemaining)}</span>
            </div>
          </div>
          <CardDescription className="text-blue-100 text-lg mt-2">
            Assess your leadership capabilities and identify areas for growth
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <Progress value={calculateProgress()} className="w-full h-3" />
            <p className="text-sm text-gray-600 mt-2">
              Progress: {Math.round(calculateProgress())}% complete
            </p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentArea}-${currentQuestion}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-blue-700">
                    {currentAreaData.area}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-xl font-medium text-gray-900 mb-4 block">
                      {currentQuestionData.ratingQuestion.split("\n\n")[0]}
                    </Label>
                    <div className="flex items-center space-x-2 mb-4">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          type="button"
                          onClick={() => handleInputChange("rating", rating)}
                          variant="outline"
                          className={`w-12 h-12 p-0 ${
                            (responses[
                              `${currentArea}-${currentQuestion}-rating`
                            ] || 0) >= rating
                              ? "bg-blue-500 text-white"
                              : "text-blue-500"
                          }`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              (responses[
                                `${currentArea}-${currentQuestion}-rating`
                              ] || 0) >= rating
                                ? "fill-current"
                                : "stroke-current"
                            }`}
                          />
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Rate from 1 (Not Effectively) to 5 (Very Effectively)
                    </p>
                    <p className="text-gray-700 whitespace-pre-line text-lg">
                      {currentQuestionData.ratingQuestion
                        .split("\n\n")
                        .slice(1)
                        .join("\n\n")}
                    </p>
                  </div>
                  <div>
                    <Label
                      htmlFor="response"
                      className="text-xl font-medium text-gray-900 mb-2 block"
                    >
                      Your Response:
                    </Label>
                    <Textarea
                      id="response"
                      value={
                        responses[
                          `${currentArea}-${currentQuestion}-response`
                        ] || ""
                      }
                      onChange={(e) =>
                        handleInputChange("response", e.target.value)
                      }
                      placeholder="Enter your response here"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[150px] text-lg"
                    />
                  </div>
                  <div>
                    <Label className="text-xl font-medium text-gray-900 mb-2 block">
                      {currentQuestionData.reflection.split("\n\n")[0]}
                    </Label>
                    <div className="flex items-center space-x-2 mb-4">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          type="button"
                          onClick={() =>
                            handleInputChange("reflectionRating", rating)
                          }
                          variant="outline"
                          className={`w-12 h-12 p-0 ${
                            (responses[
                              `${currentArea}-${currentQuestion}-reflectionRating`
                            ] || 0) >= rating
                              ? "bg-blue-500 text-white"
                              : "text-blue-500"
                          }`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              (responses[
                                `${currentArea}-${currentQuestion}-reflectionRating`
                              ] || 0) >= rating
                                ? "fill-current"
                                : "stroke-current"
                            }`}
                          />
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Rate from 1 (Not Confident) to 5 (Very Confident)
                    </p>
                    <p className="text-gray-700 mb-4 whitespace-pre-line text-lg">
                      {currentQuestionData.reflection
                        .split("\n\n")
                        .slice(1)
                        .join("\n\n")}
                    </p>
                    <Textarea
                      id="reflection"
                      value={
                        responses[
                          `${currentArea}-${currentQuestion}-reflection`
                        ] || ""
                      }
                      onChange={(e) =>
                        handleInputChange("reflection", e.target.value)
                      }
                      placeholder="Enter your reflection here"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[150px] text-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentArea === 0 && currentQuestion === 0}
              variant="outline"
              className="flex items-center text-lg"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              variant="outline"
              className="flex items-center text-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Progress
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center text-lg"
            >
              {currentArea === assessmentData.length - 1 &&
              currentQuestion ===
                assessmentData[currentArea].questions.length - 1 ? (
                isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  "Complete Assessment"
                )
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
