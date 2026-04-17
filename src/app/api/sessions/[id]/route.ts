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

    // Get all questions for this session
    const sessionQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.sessionId, sessionId))
      .orderBy(questions.questionIndex);

    return NextResponse.json({
      id: sessionData.id,
      domain: sessionData.domain,
      difficulty: sessionData.difficulty,
      questionCount: sessionData.questionCount,
      currentQuestionIndex: sessionData.currentQuestionIndex,
      status: sessionData.status,
      questions: sessionQuestions.map(q => ({
        id: q.id,
        questionIndex: q.questionIndex,
        questionText: q.questionText,
        questionType: q.questionType,
        userAnswer: q.userAnswer,
        feedback: q.feedback ? JSON.parse(q.feedback) : null,
      }))
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}