import { openai } from "./config";
import { handleToolCalls } from "./toolCalls";

export async function waitForRunCompletion(threadId: string, runId: string) {
  try {
    let run;
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loops

    do {
      if (attempts >= maxAttempts) {
        throw new Error("Maximum attempts reached waiting for run completion");
      }

      run = await openai.beta.threads.runs.retrieve(threadId, runId);

      if (
        run.status === "requires_action" &&
        run.required_action?.type === "submit_tool_outputs"
      ) {
        const toolCalls = run.required_action.submit_tool_outputs.tool_calls;
        const toolOutputs = await handleToolCalls(toolCalls);

        await openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
          tool_outputs: toolOutputs,
        });
      }

      if (run.status === "failed") {
        throw new Error(
          `Assistant run failed: ${run.last_error?.message || "Unknown error"}`
        );
      }

      if (!["completed", "failed"].includes(run.status)) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      attempts++;
    } while (!["completed", "failed"].includes(run.status));

    const messages = await openai.beta.threads.messages.list(threadId);

    if (!messages.data[0]?.content[0]) {
      throw new Error("No message content found");
    }

    // Safely extract the content
    const messageContent = messages.data[0].content[0];
    if ("text" in messageContent) {
      return messageContent.text.value;
    }

    return null;
  } catch (error) {
    console.error("Error in waitForRunCompletion:", error);
    throw error;
  }
}
