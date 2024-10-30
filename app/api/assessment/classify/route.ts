import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { classifyResponsibilityLevel } from "@/lib/classifiers/responsibility-level";
import { demographicSchema } from "@/lib/validators/demographics";
import { classifierService } from "@/lib/services/classifier-service";

export const maxDuration = 30;

export async function GET(req: Request, res: Response) {
  try {
    await classifierService.initialize();
    return Response.json({ response: "Server is Running..." });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to initialize classifier" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await classifierService.initialize();

    const demographic = await request.json();
    console.log("Demographic Info:", demographic);

    const { error, data } = demographicSchema.safeParse(demographic);

    if (error) {
      return NextResponse.json(
        { error: "Invalid demographics data", details: error },
        { status: 400 }
      );
    }

    const processedInfo = {
      ...data,
      directReports: parseInt(data.directReports, 10),
      levelsToCEO: parseInt(data.levelsToCEO, 10),
    };

    // Classify responsibility level
    const responsibilityLevel = await classifyResponsibilityLevel(
      processedInfo
    );

    console.log("responsibilityLevel", responsibilityLevel);

    // // Create assessment record
    // const assessment = await prisma.assessment.create({
    //   data: {
    //     userId: "anonymous",
    //     status: "draft",
    //     viewedBackground: false,
    //     demographics: value,
    //     responsibilityLevel: responsibilityLevel.role,
    //     capabilities: {},
    //   },
    // });

    return NextResponse.json({
      success: true,
      data: {
        // assessmentId: assessment.id,
        responsibilityLevel: responsibilityLevel.level,
        role: responsibilityLevel.role,
        description: responsibilityLevel.description,
        versionInfo: responsibilityLevel.versionInfo,
        // demographics: assessment.demographics,
        nextStep: "background",
      },
    });
  } catch (error) {
    console.error("Classification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to process assessment",
      },
      { status: 500 }
    );
  }
}
