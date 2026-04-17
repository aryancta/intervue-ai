import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sessions, questions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = params.id;

    // Get session data
    const sessionData = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, sessionId), eq(sessions.userId, session.user.id)))
      .get();

    if (!sessionData) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Get all questions with answers for this session
    const sessionQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.sessionId, sessionId))
      .orderBy(questions.questionIndex);

    // Filter only answered questions
    const answeredQuestions = sessionQuestions.filter(q => q.userAnswer && q.feedback);

    if (answeredQuestions.length === 0) {
      return NextResponse.json({ error: "No completed questions found" }, { status: 404 });
    }

    return NextResponse.json({
      id: sessionData.id,
      domain: sessionData.domain,
      difficulty: sessionData.difficulty,
      totalScore: Math.round(sessionData.totalScore || 0),
      completedAt: sessionData.completedAt,
      durationMinutes: sessionData.durationMinutes || 0,
      questions: answeredQuestions.map(q => ({
        id: q.id,
        questionIndex: q.questionIndex,
        questionText: q.questionText,
        userAnswer: q.userAnswer,
        feedback: JSON.parse(q.feedback!),
      }))
    });
  } catch (error) {
    console.error("Results fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}