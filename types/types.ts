export interface Question {
  id: string;
  question: string;
  type: "text" | "number" | "textarea" | "select" | "boolean";
  placeholder?: string;
  options?: Array<{
    value: string;
    label: string;
  }>;
  additionalInfo?: {
    question: string;
    placeholder: string;
  };
}

export interface UserInfo {
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
  description: string;
}

export interface AssessmentResponse {
  questionId?: string;
  rating?: number;
  response: string;
  reflectionRating?: number;
  reflection?: string;
  question: {
    ratingQuestion?: string;
    reflection?: string;
    question?: string;
  };
  area: string;
}
