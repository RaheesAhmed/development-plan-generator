"use client";

import { useEffect } from "react";
import { useAssessment } from "@/contexts/AssessmentContext";
import { useAssessmentApi } from "@/hooks/useAssessmentApi";
import DemographicForm from "@/components/DemographicForm";
import KnowMoreAboutAssesment from "@/components/KnowMoreAboutAssesment";
import GetAllQuestionByLevel from "@/components/GetAllQuestionByLevel";
import { DevelopmentPlan } from "@/components/DevelopmentPlan";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AssessmentFlow() {
  const {
    currentStage,
    setCurrentStage,
    assessmentData,
    setAssessmentData,
    progress,
    setProgress,
  } = useAssessment();

  const {
    isLoading,
    submitDemographics,
    getAssessmentBackground,
    generateDevelopmentPlan,
    updateProgress,
  } = useAssessmentApi();

  const handleDemographicSubmit = async (data: any) => {
    try {
      const result = await submitDemographics(data);
      setAssessmentData((prev: any) => ({ ...prev, demographics: data }));
      setCurrentStage("assessmentOptions");
      await updateProgress({
        assessmentId: result.assessmentId,
        stage: "demographic",
        completed: true,
      });
    } catch (error) {
      console.error("Error submitting demographics:", error);
    }
  };

  const handleAssessmentComplete = async (answers: any) => {
    try {
      const plan = await generateDevelopmentPlan({
        userInfo: assessmentData.demographics,
        responsibilityLevel: assessmentData.responsibilityLevel,
        assessmentAnswers: answers,
      });

      setAssessmentData((prev: any) => ({ ...prev, developmentPlan: plan }));
      setCurrentStage("planGenerated");
    } catch (error) {
      console.error("Error generating plan:", error);
    }
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case "demographic":
        return <DemographicForm onSubmit={handleDemographicSubmit} />;

      case "assessmentOptions":
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Would you like to:</h2>
            <div className="space-y-4">
              <Button
                onClick={() => setCurrentStage("knowMore")}
                className="w-full"
              >
                Learn more about the assessment
              </Button>
              <Button
                onClick={() => setCurrentStage("levelOneQuestions")}
                className="w-full"
              >
                Start the assessment now
              </Button>
            </div>
          </Card>
        );

      case "knowMore":
        return (
          <KnowMoreAboutAssesment
            level={assessmentData.responsibilityLevel?.level}
          />
        );

      case "levelOneQuestions":
        return (
          <GetAllQuestionByLevel
            level={assessmentData.responsibilityLevel?.level}
            userInfo={assessmentData.demographics}
            responsibilityLevel={assessmentData.responsibilityLevel}
            onComplete={handleAssessmentComplete}
            isLoading={isLoading}
          />
        );

      case "planGenerated":
        return <DevelopmentPlan plan={assessmentData.developmentPlan?.plan} />;

      default:
        return null;
    }
  };

  return <div className="container mx-auto py-8">{renderCurrentStage()}</div>;
}
