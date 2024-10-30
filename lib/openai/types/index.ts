interface ResponsibilityLevelOutput {
  level: string;
  explanation: string;
}

interface CapabilityAnalysis {
  capability: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
}

interface DevelopmentPlanOutput {
  executiveSummary: string;
  capabilityAnalysis: CapabilityAnalysis[];
}
