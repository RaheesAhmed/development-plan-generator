import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  const reportType = searchParams.get("type") || "summary";

  try {
    let report;
    switch (reportType) {
      case "leadership_trends":
        report = await generateLeadershipTrendsReport(companyId);
        break;
      case "capability_gaps":
        report = await generateCapabilityGapsReport(companyId);
        break;
      case "development_impact":
        report = await generateDevelopmentImpactReport(companyId);
        break;
      default:
        report = await generateSummaryReport(companyId);
    }

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error("Error generating analytics report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

async function generateSummaryReport(companyId: string | null) {
  const assessments = await prisma.assessment.findMany({
    where: companyId
      ? {
          user: {
            Company: {
              id: companyId,
            },
          },
        }
      : undefined,
    include: {
      capabilityResponses: true,
      developmentPlanDetails: true,
    },
  });

  return {
    totalAssessments: assessments.length,
    completionRate: calculateCompletionRate(assessments),
    averageScores: calculateAverageScores(assessments),
    topDevelopmentAreas: identifyTopDevelopmentAreas(assessments),
  };
}

// Helper functions for report generation
function calculateCompletionRate(assessments: any[]) {
  const completed = assessments.filter((a) => a.status === "completed").length;
  return (completed / assessments.length) * 100;
}

function calculateAverageScores(assessments: any[]) {
  // Implementation
  return {};
}

function identifyTopDevelopmentAreas(assessments: any[]) {
  // Implementation
  return [];
}
