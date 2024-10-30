import { NextResponse } from "next/server";
import { openai } from "@/lib/openai/config";
import { createAssessmentThread } from "@/lib/openai/threads";
import { waitForRunCompletion } from "@/lib/openai/utils";

export async function POST(request: Request) {
  try {
    const { userInfo, responsibilityLevel, assessmentAnswers } =
      await request.json();

    // Create a new thread for the development plan generation
    const thread = await createAssessmentThread({
      userInfo,
      responsibilityLevel,
      assessmentAnswers,
    });

    // Start the assistant run
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID!,
      instructions:
        "Generate a personalized development plan based on the assessment results.",
    });

    // Wait for completion and get the response
    const response = await waitForRunCompletion(thread.id, run.id);

    return NextResponse.json({
      success: true,
      plan: response,
    });
  } catch (error) {
    console.error("Error generating development plan:", error);
    return NextResponse.json(
      { error: "Failed to generate development plan" },
      { status: 500 }
    );
  }
}
