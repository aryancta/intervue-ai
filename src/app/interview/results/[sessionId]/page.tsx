"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  MessageSquare,
  Award,
  RotateCcw,
  Play,
  BarChart3,
  FileText,
  Share2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Brain
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

interface SessionResults {
  id: string;
  domain: string;
  difficulty: string;
  totalScore: number;
  completedAt: string;
  durationMinutes: number;
  questions: Array<{
    id: string;
    questionIndex: number;
    questionText: string;
    userAnswer: string;
    feedback: {
      clarity: { score: number; tip: string };
      depth: { score: number; tip: string };
      relevance: { score: number; tip: string };
      communication: { score: number; tip: string };
      totalScore: number;
      overallFeedback: string;
    };
  }>;
}

export default function SessionResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  
  const [results, setResults] = useState<SessionResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetchResults();
    }
  }, [sessionId]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/results`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getPerformanceIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return "Outstanding performance! 🎉";
    if (score >= 80) return "Excellent work! 👏";
    if (score >= 70) return "Good job! 👍";
    if (score >= 60) return "Not bad, room for improvement 📈";
    return "Keep practicing! 💪";
  };

  const shareScore = () => {
    const text = `Just completed an AI interview practice session! Scored ${results?.totalScore}% in ${results?.domain}. Practicing with IntervueAI 🚀`;
    navigator.clipboard.writeText(text);
    // Show toast notification
    alert("Score copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Results not found</p>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageScores = {
    clarity: Math.round(results.questions.reduce((sum, q) => sum + q.feedback.clarity.score, 0) / results.questions.length),
    depth: Math.round(results.questions.reduce((sum, q) => sum + q.feedback.depth.score, 0) / results.questions.length),
    relevance: Math.round(results.questions.reduce((sum, q) => sum + q.feedback.relevance.score, 0) / results.questions.length),
    communication: Math.round(results.questions.reduce((sum, q) => sum + q.feedback.communication.score, 0) / results.questions.length),
  };

  const radarData = [
    { subject: "Clarity", score: averageScores.clarity, fullMark: 100 },
    { subject: "Technical Depth", score: averageScores.depth, fullMark: 100 },
    { subject: "Relevance", score: averageScores.relevance, fullMark: 100 },
    { subject: "Communication", score: averageScores.communication, fullMark: 100 },
  ];

  const questionScores = results.questions.map((q, index) => ({
    question: `Q${index + 1}`,
    score: q.feedback.totalScore,
  }));

  const strengths = Object.entries(averageScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([key, score]) => ({
      area: key.charAt(0).toUpperCase() + key.slice(1),
      score,
      description: getStrengthDescription(key, score)
    }));

  const improvements = Object.entries(averageScores)
    .sort(([,a], [,b]) => a - b)
    .slice(0, 3)
    .map(([key, score]) => ({
      area: key.charAt(0).toUpperCase() + key.slice(1),
      score,
      description: getImprovementDescription(key, score)
    }));

  function getStrengthDescription(area: string, score: number) {
    const descriptions = {
      clarity: score >= 80 ? "Your answers are well-structured and easy to follow" : "Good organization in your responses",
      depth: score >= 80 ? "Excellent technical knowledge and detail" : "Good technical understanding",
      relevance: score >= 80 ? "Consistently addressed the questions directly" : "Generally stayed on topic",
      communication: score >= 80 ? "Outstanding communication skills" : "Effective communication"
    };
    return descriptions[area as keyof typeof descriptions] || "";
  }

  function getImprovementDescription(area: string, score: number) {
    const descriptions = {
      clarity: "Try structuring answers with clear intro, body, and conclusion",
      depth: "Provide more technical details and examples",
      relevance: "Focus more directly on what the question is asking",
      communication: "Use more specific examples and clearer explanations"
    };
    return descriptions[area as keyof typeof descriptions] || "";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="mb-4">
              {getPerformanceIcon(results.totalScore)}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Interview Complete!
            </h1>
            <p className="text-gray-600">{getPerformanceMessage(results.totalScore)}</p>
            
            {/* Score Display */}
            <div className="mt-6">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBg(results.totalScore)} mb-4`}>
                <span className={`text-3xl font-bold ${getScoreColor(results.totalScore)}`}>
                  {results.totalScore}%
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {results.domain} • {results.difficulty} • {results.questions.length} questions
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
                <CardDescription>
                  Your scores across different dimensions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {averageScores.clarity}%
                    </div>
                    <div className="text-sm text-blue-800">Clarity</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {averageScores.depth}%
                    </div>
                    <div className="text-sm text-green-800">Technical Depth</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {averageScores.relevance}%
                    </div>
                    <div className="text-sm text-purple-800">Relevance</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {averageScores.communication}%
                    </div>
                    <div className="text-sm text-orange-800">Communication</div>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Question by Question */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Question-by-Question Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="detailed">Detailed Review</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={questionScores}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="question" />
                          <YAxis domain={[0, 100]} />
                          <Bar dataKey="score" radius={4}>
                            {questionScores.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.score >= 80 ? "#10b981" : entry.score >= 60 ? "#f59e0b" : "#ef4444"} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="detailed" className="mt-6">
                    <div className="space-y-6">
                      {results.questions.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-gray-900">Question {index + 1}</h3>
                            <Badge className={getScoreBg(question.feedback.totalScore)}>
                              {question.feedback.totalScore}%
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{question.questionText}</p>
                          <details className="text-sm">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-700">
                              View Answer & Feedback
                            </summary>
                            <div className="mt-3 space-y-3">
                              <div>
                                <strong>Your Answer:</strong>
                                <p className="mt-1 text-gray-700">{question.userAnswer}</p>
                              </div>
                              <div>
                                <strong>Feedback:</strong>
                                <p className="mt-1 text-gray-700">{question.feedback.overallFeedback}</p>
                              </div>
                            </div>
                          </details>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Top Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {strengths.map((strength, index) => (
                  <div key={strength.area} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-green-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{strength.area}</div>
                      <div className="text-sm text-gray-600">{strength.description}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Areas to Improve */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {improvements.map((improvement, index) => (
                  <div key={improvement.area} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{improvement.area}</div>
                      <div className="text-sm text-gray-600">{improvement.description}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={shareScore} variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Score
                </Button>
                <Link href={`/interview/setup?domain=${results.domain}&difficulty=${results.difficulty}`}>
                  <Button variant="outline" className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retry Session
                  </Button>
                </Link>
                <Link href="/interview/setup">
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start New Interview
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/study-plan">
                  <Button variant="ghost" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View Study Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}