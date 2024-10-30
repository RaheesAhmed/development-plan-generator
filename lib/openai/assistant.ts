import { openai } from "./config";
import { assistantConfig } from "./config";

export async function createOrGetAssistant() {
  try {
    // Try to retrieve existing assistant
    const assistants = await openai.beta.assistants.list({
      limit: 1,
      order: "desc",
    });

    if (assistants.data.length > 0) {
      return assistants.data[0];
    }

    // Create new assistant if none exists
    const assistant = await openai.beta.assistants.create(assistantConfig);
    return assistant;
  } catch (error) {
    console.error("Error creating/getting assistant:", error);
    throw error;
  }
}
