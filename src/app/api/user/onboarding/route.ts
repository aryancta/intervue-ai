import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetRole, experienceLevel, weeklyGoal } = await request.json();

    // Update user profile with onboarding data
    await db
      .update(users)
      .set({
        targetRole,
        experienceLevel,
        weeklyGoal,
        onboardingComplete: true,
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      success: true,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}