import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sessions, questions } from "@/lib/db/schema";
import { generateInterviewQuestion } from "@/lib/ai/openai";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domain, difficulty, questionCount, useResume } = await request.json();

    // Validate input
    if (!domain || !difficulty || !questionCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create interview session
    const sessionId = randomUUID();
    await db.insert(sessions).values({
      id: sessionId,
      userId: session.user.id,
      domain,
      difficulty,
      questionCount,
      useResume: useResume || false,
      status: "active",
      currentQuestionIndex: 0,
      totalScore: 0,
    });

    // Generate the first question
    const firstQuestion = await generateInterviewQuestion(domain, difficulty);
    
    // Store the first question
    await db.insert(questions).values({
      id: randomUUID(),
      sessionId,
      questionIndex: 0,
      questionText: firstQuestion,
      questionType: "main",
    });

    return NextResponse.json({
      sessionId,
      firstQuestion: {
        text: firstQuestion,
        type: "main",
        tips: getQuestionTips(domain),
      },
      totalQuestions: questionCount,
    });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getQuestionTips(domain: string): string[] {
  const tips = {
    swe: [
      "Explain your thought process clearly",
      "Consider edge cases and error handling",
      "Discuss time and space complexity",
      "Use specific examples from your experience"
    ],
    pm: [
      "Structure your answer with frameworks",
      "Include metrics and data where possible",
      "Consider different stakeholder perspectives",
      "Focus on user impact and business value"
    ],
    ds: [
      "Explain your methodology step by step",
      "Discuss data quality and assumptions",
      "Connect technical solutions to business outcomes",
      "Mention potential biases and limitations"
    ]
  };

  return tips[domain as keyof typeof tips] || tips.swe;
}