export interface Question {
  id: string;
  question: string;
  type: "text" | "select";
  options?: string[];
  required?: boolean;
}

export interface AssessmentResponse {
  questionId: string;
  answer: string;
  category?: string;
}
