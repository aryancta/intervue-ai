"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Mic, 
  Clock, 
  Target,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  RotateCcw,
  X,
  CheckCircle,
  Award
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

interface Question {
  id: string;
  questionIndex: number;
  questionText: string;
  questionType: string;
  userAnswer?: string;
  feedback?: {
    clarity: { score: number; tip: string };
    depth: { score: number; tip: string };
    relevance: { score: number; tip: string };
    communication: { score: number; tip: string };
    totalScore: number;
    overallFeedback: string;
  };
}

interface SessionData {
  id: string;
  domain: string;
  difficulty: string;
  questionCount: number;
  currentQuestionIndex: number;
  status: string;
  questions: Question[];
}

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (sessionId) {
      fetchSessionData();
    }
  }, [sessionId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchSessionData = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching session:", error);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim() || !sessionData) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: getCurrentQuestion()?.id,
          answer: currentAnswer,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update the current question with feedback
        const updatedQuestions = [...sessionData.questions];
        const currentIndex = sessionData.currentQuestionIndex;
        if (updatedQuestions[currentIndex]) {
          updatedQuestions[currentIndex].userAnswer = currentAnswer;
          updatedQuestions[currentIndex].feedback = result.feedback;
        }

        setSessionData({
          ...sessionData,
          questions: updatedQuestions
        });

        setShowFeedback(true);
        setIsCompleted(result.isSessionComplete);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = async () => {
    if (!sessionData) return;

    if (isCompleted) {
      router.push(`/interview/results/${sessionId}`);
      return;
    }

    setIsLoadingNext(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/next-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        
        // Add the new question to the session
        const updatedQuestions = [...sessionData.questions];
        updatedQuestions.push({
          id: result.question.id,
          questionIndex: sessionData.currentQuestionIndex + 1,
          questionText: result.question.text,
          questionType: result.question.type,
        });

        setSessionData({
          ...sessionData,
          currentQuestionIndex: sessionData.currentQuestionIndex + 1,
          questions: updatedQuestions
        });

        // Reset state for next question
        setCurrentAnswer("");
        setShowFeedback(false);
        setIsCompleted(result.isLast);
      }
    } catch (error) {
      console.error("Error getting next question:", error);
    } finally {
      setIsLoadingNext(false);
    }
  };

  const endInterview = () => {
    if (confirm("Are you sure you want to end the interview? Your progress will be saved.")) {
      router.push(`/interview/results/${sessionId}`);
    }
  };

  const getCurrentQuestion = () => {
    if (!sessionData) return null;
    return sessionData.questions[sessionData.currentQuestionIndex];
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressPercentage = () => {
    if (!sessionData) return 0;
    return ((sessionData.currentQuestionIndex + 1) / sessionData.questionCount) * 100;
  };

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p>Loading interview session...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>No question available</p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const feedbackData = currentQuestion.feedback ? [
    { subject: "Clarity", score: currentQuestion.feedback.clarity.score, fullMark: 100 },
    { subject: "Depth", score: currentQuestion.feedback.depth.score, fullMark: 100 },
    { subject: "Relevance", score: currentQuestion.feedback.relevance.score, fullMark: 100 },
    { subject: "Communication", score: currentQuestion.feedback.communication.score, fullMark: 100 },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-lg font-semibold">Interview Session</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {sessionData.domain}
                  </Badge>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {sessionData.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(timeElapsed)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Question {sessionData.currentQuestionIndex + 1} of {sessionData.questionCount}
              </div>
              <Button variant="outline" size="sm" onClick={endInterview}>
                <X className="h-4 w-4 mr-1" />
                End Interview
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Interview Area */}
          <div className="lg:col-span-2">
            {/* Interviewer Message */}
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-2">AI Interviewer</h3>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-100">{currentQuestion.questionText}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answer Area */}
            {!showFeedback && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Your Answer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here... Take your time and think through your response."
                    className="min-h-[120px] bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    disabled={isSubmitting}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{currentAnswer.length} characters</span>
                      <div className="flex items-center space-x-1">
                        <Mic className="h-4 w-4" />
                        <span>Voice input (UI only)</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={submitAnswer}
                      disabled={!currentAnswer.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Analyzing...
                        </div>
                      ) : (
                        <>
                          Submit Answer
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feedback Display */}
            {showFeedback && currentQuestion.feedback && (
              <div className="space-y-6">
                {/* User's Answer */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Your Answer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-100">{currentQuestion.userAnswer}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback Card */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Award className="h-5 w-5" />
                      Feedback & Scoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Overall Score */}
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(currentQuestion.feedback.totalScore)}`}>
                        {currentQuestion.feedback.totalScore}%
                      </div>
                      <p className="text-gray-400">Overall Score</p>
                    </div>

                    {/* Dimension Scores */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-300">Clarity</span>
                          <span className={`font-bold ${getScoreColor(currentQuestion.feedback.clarity.score)}`}>
                            {currentQuestion.feedback.clarity.score}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{currentQuestion.feedback.clarity.tip}</p>
                      </div>

                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-300">Technical Depth</span>
                          <span className={`font-bold ${getScoreColor(currentQuestion.feedback.depth.score)}`}>
                            {currentQuestion.feedback.depth.score}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{currentQuestion.feedback.depth.tip}</p>
                      </div>

                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-300">Relevance</span>
                          <span className={`font-bold ${getScoreColor(currentQuestion.feedback.relevance.score)}`}>
                            {currentQuestion.feedback.relevance.score}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{currentQuestion.feedback.relevance.tip}</p>
                      </div>

                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-300">Communication</span>
                          <span className={`font-bold ${getScoreColor(currentQuestion.feedback.communication.score)}`}>
                            {currentQuestion.feedback.communication.score}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{currentQuestion.feedback.communication.tip}</p>
                      </div>
                    </div>

                    {/* Overall Feedback */}
                    <div className="bg-blue-900 rounded-lg p-4">
                      <h4 className="font-medium text-blue-200 mb-2">Overall Feedback</h4>
                      <p className="text-blue-100 text-sm">{currentQuestion.feedback.overallFeedback}</p>
                    </div>

                    {/* Continue Button */}
                    <Button 
                      onClick={nextQuestion}
                      disabled={isLoadingNext}
                      className="w-full"
                      size="lg"
                    >
                      {isLoadingNext ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Loading...
                        </div>
                      ) : isCompleted ? (
                        <>
                          View Results
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Continue to Next Question
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Context Panel */}
          <div className="space-y-6">
            {/* Session Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Session Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Domain:</span>
                  <span className="text-white">{sessionData.domain}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Difficulty:</span>
                  <span className="text-white">{sessionData.difficulty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress:</span>
                  <span className="text-white">
                    {sessionData.currentQuestionIndex + 1}/{sessionData.questionCount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-white">{formatTime(timeElapsed)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            {showFeedback && feedbackData.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">This Question's Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={feedbackData}>
                        <PolarGrid stroke="#374151" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Previous Questions */}
            {sessionData.questions.filter(q => q.feedback).length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Previous Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sessionData.questions
                    .filter(q => q.feedback)
                    .map((question, index) => (
                      <div key={question.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Q{question.questionIndex + 1}</span>
                        <Badge 
                          className={
                            question.feedback!.totalScore >= 80 
                              ? "bg-green-900 text-green-200" 
                              : question.feedback!.totalScore >= 60 
                              ? "bg-yellow-900 text-yellow-200" 
                              : "bg-red-900 text-red-200"
                          }
                        >
                          {question.feedback!.totalScore}%
                        </Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}