import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { adminAuthMiddleware } from "@/lib/auth/adminMiddleware";

export async function GET(req: NextRequest) {
  const authError = await adminAuthMiddleware(req);
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
