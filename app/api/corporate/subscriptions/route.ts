import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySubscription } from "@/lib/billing";

export async function POST(request: Request) {
  try {
    const {
      companyId,
      plan,
      maxUsers,
      features,
      apiAccess,
      analyticsAccess,
      endDate,
    } = await request.json();

    const verified = await verifySubscription({ plan });
    if (!verified) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 }
      );
    }

    const subscription = await prisma.corporateSubscription.create({
      data: {
        companyId,
        plan,
        maxUsers,
        features,
        apiAccess,
        analyticsAccess,
        endDate: new Date(endDate),
      },
      include: {
        company: {
          select: {
            name: true,
            domain: true,
            users: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: subscription });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");

  try {
    const subscription = await prisma.corporateSubscription.findUnique({
      where: { companyId },
      include: {
        company: {
          select: {
            name: true,
            domain: true,
            users: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: subscription });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
