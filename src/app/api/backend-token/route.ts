import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login first." },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is missing.");
    }

    const token = jwt.sign(
      {
        email: session.user.email,
      },
      secret,
      {
        subject: session.user.id,
        expiresIn: "15m",
      }
    );

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Token creation error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create token." },
      { status: 500 }
    );
  }
}