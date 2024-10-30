import { NextResponse } from "next/server";
import { getLevelTwoQuestions } from "@/utils/get_all_questions";

interface Params {
  level: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  const { level } = params;
  const levelTwoQuestions = await getLevelTwoQuestions();
  console.log("Fetching level two questions for level:", level);
  console.log("Total level two questions:", levelTwoQuestions?.length || 0);

  // Normalize the level string and convert to number
  const normalizedLevel = parseInt(level);

  if (isNaN(normalizedLevel)) {
    console.warn("Invalid level provided:", level);
    return [];
  }

  console.log("Normalized level:", normalizedLevel);

  // Filter questions for the specified level
  const filteredQuestions = levelTwoQuestions.filter(
    (q: any) => q.Lvl === normalizedLevel
  );

  console.log("Total level two questions found:", filteredQuestions.length);
  console.log("Filtered questions:", filteredQuestions);
  return NextResponse.json({
    filteredQuestions,
  });
}
