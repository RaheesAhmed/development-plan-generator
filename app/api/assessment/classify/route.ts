import { NextResponse } from "next/server";
import { classifyResponsibilityLevel } from "@/lib/classifiers/responsibility-level";
import { demographicSchema } from "@/lib/validators/demographics";
import { classifierService } from "@/lib/services/classifier-service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      directReports: data.directReports.toString(),
      levelsToCEO: data.levelsToCEO.toString(),
      companySize: data.companySize.toString(),
      managesBudget: data.managesBudget.toString(),
    };

    const responsibilityLevel = await classifyResponsibilityLevel(
      processedInfo
    );

    const user = await prisma.user.upsert({
      where: {
        email: data.email || "default@example.com",
      },
      update: {},
      create: {
        email: data.email || "default@example.com",
        hashedPassword: "temporary-hash",
        name: data.name || "Anonymous",
      },
    });

    const savedDemographic = await prisma.demographic.create({
      data: {
        industry: data.industry,
        companySize: processedInfo.companySize,
        department: data.department,
        jobTitle: data.jobTitle,
        directReports: processedInfo.directReports,
        decisionLevel: data.decisionLevel,
        typicalProject: data.typicalProject,
        levelsToCEO: processedInfo.levelsToCEO,
        managesBudget: processedInfo.managesBudget,
        user: {
          connect: { id: user.id },
        },
      },
    });

    const assessment = await prisma.assessment.create({
      data: {
        user: {
          connect: { id: user.id },
        },
        responsibilityLevel: JSON.stringify({
          level: responsibilityLevel.level,
          role: responsibilityLevel.role,
          description: responsibilityLevel.description,
        }),
      },
    });

    console.log("responsibilityLevel", responsibilityLevel);

    return NextResponse.json({
      success: true,
      data: {
        responsibilityLevel: responsibilityLevel.level,
        role: responsibilityLevel.role,
        description: responsibilityLevel.description,
        versionInfo: responsibilityLevel.versionInfo,
        nextStep: "background",
        assessmentId: assessment.id,
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
  } finally {
    await prisma.$disconnect();
  }
}
