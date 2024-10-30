import { NextResponse } from "next/server";

export async function GET() {
  try {
    const instructions = {
      steps: [
        {
          step: 1,
          title: "Demographic Information",
          description:
            "You'll start by providing basic information about yourself...",
        },
        {
          step: 2,
          title: "Assessment Questions",
          description:
            "You'll answer questions about your leadership capabilities...",
        },
        // Add more steps
      ],
      guidelines: [
        "Take your time to answer thoughtfully",
        "Be honest in your self-assessment",
        // Add more guidelines
      ],
    };

    return NextResponse.json({ instructions });
  } catch (error) {
    console.error("Error fetching instructions:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessment instructions" },
      { status: 500 }
    );
  }
}
