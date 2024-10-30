import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateIntegrationConfig } from "@/lib/integrations";

export async function POST(request: Request) {
  try {
    const integrationData = await request.json();
    const isValid = await validateIntegrationConfig(integrationData);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid integration configuration" },
        { status: 400 }
      );
    }

    const integration = await prisma.partnerIntegration.create({
      data: integrationData,
    });

    return NextResponse.json({ success: true, data: integration });
  } catch (error) {
    console.error("Error creating integration:", error);
    return NextResponse.json(
      { error: "Failed to create integration" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const partnerId = searchParams.get("partnerId");

  try {
    const integrations = await prisma.partnerIntegration.findMany({
      where: { partnerId },
    });

    return NextResponse.json({ success: true, data: integrations });
  } catch (error) {
    console.error("Error fetching integrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch integrations" },
      { status: 500 }
    );
  }
}
