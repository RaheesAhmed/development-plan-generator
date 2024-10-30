import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { sendInvitationEmail } from "@/lib/email";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    // Get all multi-rater assessments
    const assessments = await prisma.multiRaterAssessment.findMany({
      include: {
        raters: true,
        assessment: {
          include: {
            capabilityResponses: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: assessments || [],
    });
  } catch (error) {
    console.error("Error fetching multi-rater assessments:", error);
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: "Database connection error. Please try again later." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch multi-rater assessments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { assessmentId, primaryUserId, raters, dueDate } =
      await request.json();

    if (!assessmentId || !primaryUserId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const multiRaterAssessment = await prisma.multiRaterAssessment.create({
      data: {
        assessmentId,
        primaryUserId,
        dueDate: new Date(dueDate),
        raters: {
          create: raters.map((rater: any) => ({
            email: rater.email,
            relationship: rater.relationship,
            status: "invited",
          })),
        },
      },
      include: {
        raters: true,
        assessment: true,
      },
    });

    // Send invitations to all raters
    for (const rater of raters) {
      await sendInvitationEmail(rater.email, assessmentId);
    }

    return NextResponse.json({ success: true, data: multiRaterAssessment });
  } catch (error) {
    console.error("Error creating multi-rater assessment:", error);
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: "Database connection error. Please try again later." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create multi-rater assessment" },
      { status: 500 }
    );
  }
}
