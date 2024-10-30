import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { raterId, assessmentId, feedback } = await request.json();

    const raterFeedback = await prisma.rater.update({
      where: { id: raterId },
      data: {
        status: "completed",
        completedAt: new Date(),
        assessment: {
          update: {
            capabilityResponses: {
              create: feedback.map((response: any) => ({
                capability: response.capability,
                skillRating: response.rating,
                confidenceRating: response.confidence,
                focusAreas: response.focusAreas,
              })),
            },
          },
        },
      },
      include: {
        assessment: {
          include: {
            capabilityResponses: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: raterFeedback });
  } catch (error) {
    console.error("Error submitting rater feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
