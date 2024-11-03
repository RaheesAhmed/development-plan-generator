import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/services/db-service";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { error, data } = userSchema.safeParse(body);

    if (error) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        hashedPassword,
        name: data.name,
      },
    });

    const { hashedPassword: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
