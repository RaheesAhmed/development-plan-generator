import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const authError = await getServerSession(authOptions);
  if (authError) return authError;

  try {
    const consultants = await prisma.consultantProfile.findMany({
      include: {
        user: true,
        apiUsage: true,
      },
    });

    return NextResponse.json(consultants);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
