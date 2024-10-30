export interface Question {
  id: string;
  question: string;
  type: "select" | "text";
  placeholder: string;
  options?: Array<{
    value: string;
    label: string;
  }>;
  additionalInfo?: string;
}

export interface FormData {
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

export interface ResponsibilityLevel {
  level: number;
  role: string;
  description: string;
}

export interface AssessmentResponse {
  questionId: string;
  answer: string;
  // Add any other required fields
}

export type AssessmentStage =
  | "demographic"
  | "assessmentOptions"
  | "assessmentChoices"
  | "knowMore"
  | "levelOneQuestions"
  | "skipAssessment"
  | "planGenerated";
