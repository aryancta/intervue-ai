import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sessions, questions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { evaluateAnswer } from "@/lib/ai/openai";

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
    const { questionId, answer } = await request.json();

    if (!questionId || !answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get session and question data
    const sessionData = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, sessionId), eq(sessions.userId, session.user.id)))
      .get();

    if (!sessionData) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const question = await db
      .select()
      .from(questions)
      .where(and(eq(questions.id, questionId), eq(questions.sessionId, sessionId)))
      .get();

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Evaluate the answer using AI
    const feedback = await evaluateAnswer(question.questionText, answer, sessionData.domain);

    // Update the question with answer and feedback
    await db
      .update(questions)
      .set({
        userAnswer: answer,
        clarityScore: feedback.clarity.score,
        depthScore: feedback.depth.score,
        relevanceScore: feedback.relevance.score,
        communicationScore: feedback.communication.score,
        totalScore: feedback.totalScore,
        feedback: JSON.stringify(feedback),
        answeredAt: new Date().toISOString(),
      })
      .where(eq(questions.id, questionId));

    // Check if this is the last question
    const isSessionComplete = (sessionData.currentQuestionIndex + 1) >= sessionData.questionCount;

    if (isSessionComplete) {
      // Calculate overall session score
      const allQuestions = await db
        .select()
        .from(questions)
        .where(eq(questions.sessionId, sessionId));

      const totalScore = allQuestions.reduce((sum, q) => sum + (q.totalScore || 0), 0) / allQuestions.length;

      // Update session as completed
      await db
        .update(sessions)
        .set({
          status: "completed",
          totalScore,
          completedAt: new Date().toISOString(),
        })
        .where(eq(sessions.id, sessionId));
    }

    return NextResponse.json({
      feedback,
      isSessionComplete,
    });
  } catch (error) {
    console.error("Answer submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}