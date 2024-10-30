import { openai } from "./config";

interface Demographics {
  [key: string]: any;
}

export async function createAssessmentThread(demographics: Demographics) {
  try {
    const thread = await openai.beta.threads.create();

    // Ensure demographics is properly stringified
    const demographicsString = JSON.stringify(demographics, null, 2);

    // Add initial message with demographics
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `New assessment started. Demographics information: ${demographicsString}`,
    });

    return thread;
  } catch (error) {
    console.error("Error creating assessment thread:", error);
    throw error;
  }
}
