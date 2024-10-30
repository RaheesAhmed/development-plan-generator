import OpenAI from "openai";
import { AssistantCreateParams } from "openai/resources/beta/assistants/assistants";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initial assistant configuration
export const assistantConfig: AssistantCreateParams = {
  name: "Leadership Assessment Assistant",
  description: "Expert in leadership assessment and development planning",
  model: "gpt-4-turbo-preview",
  tools: [
    {
      type: "function",
      function: {
        name: "determine_responsibility_level",
        description:
          "Determines the user's responsibility level based on demographics",
        parameters: {
          type: "object",
          properties: {
            level: {
              type: "string",
              enum: [
                "Individual Contributor",
                "Team Lead",
                "Supervisor",
                "Manager",
                "Senior Manager / Associate Director",
                "Director",
                "Senior Director / Vice President",
                "Senior Vice President",
                "Executive Vice President",
                "Chief Officer",
              ],
            },
            explanation: {
              type: "string",
              description: "Explanation of why this level was chosen",
            },
            assessmentId: {
              type: "string",
              description: "The ID of the assessment being processed",
            },
          },
          required: ["level", "explanation", "assessmentId"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "generate_development_plan",
        description:
          "Generates a personalized development plan based on assessment results",
        parameters: {
          type: "object",
          properties: {
            executiveSummary: {
              type: "string",
              description: "Brief overview of assessment results",
            },
            capabilityAnalysis: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  capability: { type: "string" },
                  strengths: { type: "array", items: { type: "string" } },
                  areasForImprovement: {
                    type: "array",
                    items: { type: "string" },
                  },
                  recommendations: { type: "array", items: { type: "string" } },
                },
              },
            },
            assessmentId: {
              type: "string",
              description: "The ID of the assessment being processed",
            },
          },
          required: ["executiveSummary", "capabilityAnalysis", "assessmentId"],
        },
      },
    },
  ],
  file_ids: [], // We'll upload framework files and add their IDs here
};
