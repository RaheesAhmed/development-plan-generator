"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AssessmentStage } from "@/types/assessment";

interface AssessmentContextType {
  currentStage: AssessmentStage;
  setCurrentStage: (stage: AssessmentStage) => void;
  assessmentData: any;
  setAssessmentData: (data: any) => void;
  progress: number;
  setProgress: (progress: number) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined
);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [currentStage, setCurrentStage] =
    useState<AssessmentStage>("demographic");
  const [assessmentData, setAssessmentData] = useState({});
  const [progress, setProgress] = useState(0);

  return (
    <AssessmentContext.Provider
      value={{
        currentStage,
        setCurrentStage,
        assessmentData,
        setAssessmentData,
        progress,
        setProgress,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
}
