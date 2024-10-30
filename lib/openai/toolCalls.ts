import { Run } from "openai/resources/beta/threads/runs/runs";
import { prisma } from "@/lib/db";

type ToolCall = Run.RequiredActionFunctionToolCall;

export async function handleToolCalls(toolCalls: ToolCall[] = []) {
  const toolOutputs = [];

  for (const toolCall of toolCalls) {
    const functionName = toolCall.function.name;
    const functionArgs = JSON.parse(toolCall.function.arguments);

    let output;
    switch (functionName) {
      case "determine_responsibility_level":
        output = await handleResponsibilityLevel(
          functionArgs.level,
          functionArgs.explanation,
          functionArgs.assessmentId
        );
        break;
      case "generate_development_plan":
        output = await handleDevelopmentPlan(functionArgs);
        break;
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }

    toolOutputs.push({
      tool_call_id: toolCall.id,
      output: JSON.stringify(output),
    });
  }

  return toolOutputs;
}

async function handleResponsibilityLevel(
  level: string,
  explanation: string,
  assessmentId: string
) {
  try {
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        responsibilityLevel: level,
        responsibilityLevelExplanation: explanation,
      },
    });

    return { success: true, level, explanation };
  } catch (error) {
    console.error("Error handling responsibility level:", error);
    throw error;
  }
}

async function handleDevelopmentPlan(args: {
  executiveSummary: string;
  capabilityAnalysis: any[];
  assessmentId: string;
}) {
  try {
    const { executiveSummary, capabilityAnalysis, assessmentId } = args;

    const developmentPlan = {
      executiveSummary,
      capabilityAnalysis,
      generatedAt: new Date().toISOString(),
      status: "completed",
    };

    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        developmentPlan,
        status: "completed",
      },
    });

    return {
      success: true,
      message: "Development plan generated and stored successfully",
    };
  } catch (error) {
    console.error("Error handling development plan:", error);
    throw error;
  }
}
