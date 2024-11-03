import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/auth/jwt";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJwtToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = {
      id: decoded.userId,
      email: decoded.email,
      isAdmin: decoded.isAdmin,
    };

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
