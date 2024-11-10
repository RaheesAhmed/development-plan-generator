import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const authError = await getServerSession(authOptions);
  if (authError) return authError;

  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: true,
      },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
