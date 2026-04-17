import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sessions, questions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { generateInterviewQuestion } from "@/lib/ai/openai";
import { randomUUID } from "crypto";

export async function POST(
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

    const nextQuestionIndex = sessionData.currentQuestionIndex + 1;
    
    // Check if we've reached the end
    if (nextQuestionIndex >= sessionData.questionCount) {
      return NextResponse.json({ error: "No more questions" }, { status: 400 });
    }

    // Get previous questions to avoid duplicates
    const previousQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.sessionId, sessionId));

    const previousQuestionTexts = previousQuestions.map(q => q.questionText);

    // Generate next question
    const nextQuestionText = await generateInterviewQuestion(
      sessionData.domain,
      sessionData.difficulty,
      undefined, // TODO: Add resume data
      previousQuestionTexts
    );

    // Create the next question
    const questionId = randomUUID();
    await db.insert(questions).values({
      id: questionId,
      sessionId,
      questionIndex: nextQuestionIndex,
      questionText: nextQuestionText,
      questionType: "main",
    });

    // Update session's current question index
    await db
      .update(sessions)
      .set({
        currentQuestionIndex: nextQuestionIndex,
      })
      .where(eq(sessions.id, sessionId));

    const isLast = (nextQuestionIndex + 1) >= sessionData.questionCount;

    return NextResponse.json({
      question: {
        id: questionId,
        text: nextQuestionText,
        type: "main",
      },
      questionIndex: nextQuestionIndex,
      isLast,
    });
  } catch (error) {
    console.error("Next question error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}