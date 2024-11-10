import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const authError = await getServerSession(authOptions);
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
