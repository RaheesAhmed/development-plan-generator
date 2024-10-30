import OpenAI from "openai";
import { AssessmentResponse } from "@/types/types";

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

    // Create message with structured prompt
    const prompt = `Please generate a development plan for provided user profile. and assessment results.
    here is the user profile: ${JSON.stringify(userInfo)}
    here is the assessment results: ${JSON.stringify(assessmentAnswers)}
    here is the responsibility level: ${JSON.stringify(responsibilityLevel)}

    
    Please provide a structured development plan with clear action items and timelines.`;

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: prompt,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id,
      instructions:
        "Generate a clear, actionable development plan. Focus on specific skills, behaviors, and learning opportunities.",
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
