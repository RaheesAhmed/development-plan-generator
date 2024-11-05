import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  try {
    const where = userId ? { userId } : {};

    const assessments = await prisma.assessment.findMany({
      where,
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
