import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateWebhookSignature } from "@/lib/integrations";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-webhook-signature");
    const payload = await request.json();

    if (!signature || !validateWebhookSignature(signature, payload)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // Process webhook based on type
    switch (payload.type) {
      case "user_sync":
        await handleUserSync(payload.data);
        break;
      case "completion_sync":
        await handleCompletionSync(payload.data);
        break;
      case "development_sync":
        await handleDevelopmentSync(payload.data);
        break;
      default:
        return NextResponse.json(
          { error: "Unknown webhook type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

async function handleUserSync(data: any) {
  await prisma.user.upsert({
    where: { email: data.email },
    update: {
      name: data.name,
      // Add other fields to sync
    },
    create: {
      email: data.email,
      name: data.name,
      // Add other fields to sync
    },
  });
}

async function handleCompletionSync(data: any) {
  await prisma.assessment.update({
    where: { id: data.assessmentId },
    data: {
      status: "completed",
      // Add other completion data
    },
  });
}

async function handleDevelopmentSync(data: any) {
  await prisma.developmentPlan.update({
    where: { assessmentId: data.assessmentId },
    data: {
      // Update development plan with external system data
      actionPlan: data.actionPlan,
      resources: data.resources,
    },
  });
}
