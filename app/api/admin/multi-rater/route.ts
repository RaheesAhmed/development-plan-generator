import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { adminAuthMiddleware } from "@/lib/auth/adminMiddleware";

export async function GET(req: NextRequest) {
  const authError = await adminAuthMiddleware(req);
  if (authError) return authError;

  try {
    const assessments = await prisma.multiRaterAssessment.findMany({
      include: {
        user: true,
        ratings: true,
      },
    });

    return NextResponse.json(assessments);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
