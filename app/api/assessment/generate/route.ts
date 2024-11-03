import OpenAI from "openai";
import { AssessmentResponse } from "@/types/types";
import { PLAN_INSTRUCTIONS } from "@/prompts/plan_instructions";
import { prisma } from "@/lib/services/db-service";

export const runtime = "edge";
export const maxDuration = 300;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistant_id = process.env.OPENAI_ASSISTANT_ID as string;

if (!assistant_id) {
  throw new Error("OPENAI_ASSISTANT_ID is not defined");
}

interface GenerateRequestBody {
  userInfo: {
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
    userId: string;
  };
  responsibilityLevel: {
    level: number;
    role: string;
    description: string;
  };
  assessmentAnswers?: AssessmentResponse[];
  assessmentCompleted: boolean;
}

export async function POST(request: Request) {
  try {
    const body: GenerateRequestBody = await request.json();
    const {
      userInfo,
      responsibilityLevel,
      assessmentAnswers,
      assessmentCompleted,
    } = body;

    const threadId = (await openai.beta.threads.create()).id;

    // Create different prompts based on assessment completion
    const promptContent = assessmentCompleted
      ? `Generate a comprehensive professional development plan following this structured format. The plan should be specific, actionable, and deeply personalized.
         here is the user profile: ${JSON.stringify(userInfo)}
         here is the assessment results: ${JSON.stringify(assessmentAnswers)}
         here is the responsibility level: ${JSON.stringify(
           responsibilityLevel
         )}
        `
      : `Generate a comprehensive professional development plan following this structured format. The plan should be specific, actionable, and deeply personalized based on the available information.
         here is the user profile: ${JSON.stringify(userInfo)}
         here is the responsibility level: ${JSON.stringify(
           responsibilityLevel
         )}

         
        `;

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: `${promptContent}
      
      `,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id,
      instructions: PLAN_INSTRUCTIONS,
    });

    // Poll for completion
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    let attempts = 0;
    const maxAttempts = 30;

    while (
      (runStatus.status === "queued" || runStatus.status === "in_progress") &&
      attempts < maxAttempts
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      attempts++;
    }

    if (runStatus.status === "completed") {
      const messages = await openai.beta.threads.messages.list(threadId);
      const latestMessage = messages.data[0];

      if (latestMessage.content[0].type === "text") {
        const plan = latestMessage.content[0].text.value;

        return Response.json({ success: true, plan });
      }
    }

    throw new Error(`Failed to generate plan. Status: ${runStatus.status}`);
  } catch (error) {
    console.error("Error in generate route:", error);
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to generate plan",
      },
      { status: 500 }
    );
  }
}
