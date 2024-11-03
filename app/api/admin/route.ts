import { NextResponse } from "next/server";
import { prisma } from "@/lib/services/db-service";
import { verifyJwtToken } from "@/lib/auth/jwt";

// Helper function to check if user is admin
async function isAdmin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === "ADMIN" || false;
}

export async function GET(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // Verify the token
    const token = authHeader.split(" ")[1];
    const decoded = await verifyJwtToken(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminStatus = await isAdmin(decoded.userId);
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Fetch all users with their related data
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        assessments: {
          orderBy: { updatedAt: "desc" },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Format the response data with type safety
    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.role === "ADMIN",
      createdAt: user.updatedAt.toISOString(),
      profile: user.profile,
      latestAssessment: user.assessments[0] || null,
      status: user.assessments.length > 0 ? "completed" : "pending",
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error("Admin route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add admin user
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyJwtToken(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminStatus = await isAdmin(decoded.userId);
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { email } = await request.json();

    // Update user to admin status
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isAdmin: updatedUser.role === "ADMIN",
      },
    });
  } catch (error) {
    console.error("Admin route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
