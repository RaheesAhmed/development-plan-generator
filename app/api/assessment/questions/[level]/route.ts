import { NextResponse } from "next/server";
import { getLevelOneQuestionsByLevel } from "@/utils/get_all_questions";

interface Params {
  level: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  const { level } = params;
  console.log("level recieved", level);
  const levelOneQuestions = await getLevelOneQuestionsByLevel({ level });
  return NextResponse.json({
    assessmentQuestionsByLevel: levelOneQuestions,
  });
}
