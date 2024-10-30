import { NextResponse } from "next/server";
import { getLevelTwoQuestions } from "@/utils/get_all_questions";

export async function GET(request: Request) {
  try {
    const aboutQuestions = await getLevelTwoQuestions();
    return NextResponse.json({
      aboutQuestions,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Error fetching questions about Assessment.",
    });
  }
}
