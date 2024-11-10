import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { adminAuthMiddleware } from "@/lib/auth/adminMiddleware";

export async function GET(req: NextRequest) {
  const authError = await adminAuthMiddleware(req);
  if (authError) return authError;

  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  try {
    const where = userId ? { userId } : {};

    const plans = await prisma.developmentPlan.findMany({
      where,
      include: {
        user: true,
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
