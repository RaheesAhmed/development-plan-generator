import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateApiKey } from "@/lib/utils";

export async function POST(request: Request) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database connection not initialized" },
      { status: 500 }
    );
  }

  try {
    const { userId, name, company, whitelabelConfig, revenueShare } =
      await request.json();
    const apiKey = generateApiKey();

    const consultant = await prisma.consultant.create({
      data: {
        userId,
        name,
        company,
        apiKey,
        whitelabelConfig,
        revenueShare: revenueShare || 0.7,
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    // Remove sensitive data before sending response
    const { apiKey: _, ...consultantData } = consultant;

    return NextResponse.json({ success: true, data: consultantData });
  } catch (error) {
    console.error("Error creating consultant account:", error);
    return NextResponse.json(
      { error: "Failed to create consultant account" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database connection not initialized" },
      { status: 500 }
    );
  }

  try {
    const consultants = await prisma.consultant.findMany({
      select: {
        id: true,
        name: true,
        company: true,
        whitelabelConfig: true,
        revenueShare: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        clients: {
          select: {
            id: true,
            client: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: consultants });
  } catch (error) {
    console.error("Error fetching consultants:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultants" },
      { status: 500 }
    );
  }
}
