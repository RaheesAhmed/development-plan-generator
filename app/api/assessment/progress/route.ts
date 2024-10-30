import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get("assessmentId");

    if (!assessmentId) {
      return NextResponse.json(
        { error: "Assessment ID is required" },
        { status: 400 }
      );
    }

    const progress = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      select: {
        status: true,
        demographics: true,
        responsibilityLevel: true,
        capabilityResponses: true,
        developmentPlanDetails: true,
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Error fetching assessment progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessment progress" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { assessmentId, status, responses } = await request.json();

    const updatedAssessment = await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        status,
        capabilityResponses: {
          create: responses,
        },
      },
      include: {
        capabilityResponses: true,
      },
    });

    return NextResponse.json({ success: true, assessment: updatedAssessment });
  } catch (error) {
    console.error("Error updating assessment progress:", error);
    return NextResponse.json(
      { error: "Failed to update assessment progress" },
      { status: 500 }
    );
  }
}
