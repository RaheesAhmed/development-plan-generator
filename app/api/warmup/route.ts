import { NextResponse } from "next/server";
import { classifierService } from "@/lib/services/classifier-service";

export async function GET() {
  try {
    await classifierService.initialize();
    return NextResponse.json({ status: "Classifier initialized successfully" });
  } catch (error) {
    console.error("Warmup error:", error);
    return NextResponse.json(
      { error: "Failed to initialize classifier" },
      { status: 500 }
    );
  }
}
