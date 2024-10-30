import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Return assessment background information
    const backgroundInfo = {
      sections: [
        {
          title: "Assessment Overview",
          content:
            "This assessment helps identify your leadership capabilities...",
        },
        {
          title: "Purpose",
          content:
            "The purpose of this assessment is to create a customized development plan...",
        },
        // Add more sections as needed
      ],
    };

    return NextResponse.json({ backgroundInfo });
  } catch (error) {
    console.error("Error fetching assessment background:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessment background information" },
      { status: 500 }
    );
  }
}
