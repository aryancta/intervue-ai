"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Award, 
  Flame,
  Play,
  BookOpen,
  BarChart3,
  Calendar,
  CheckCircle,
  ArrowRight,
  Brain,
  Code,
  Briefcase,
  Database,
  Settings,
  LogOut,
  Bell
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Cell } from "recharts";

// Mock data - in a real app, this would come from your API
const mockStats = {
  totalSessions: 12,
  averageScore: 78,
  bestScore: 92,
  currentStreak: 5,
  totalPracticeMinutes: 180,
  scoreHistory: [
    { date: "2026-04-10", score: 65 },
    { date: "2026-04-11", score: 72 },
    { date: "2026-04-12", score: 78 },
    { date: "2026-04-13", score: 75 },
    { date: "2026-04-14", score: 82 },
    { date: "2026-04-15", score: 88 },
    { date: "2026-04-16", score: 85 },
    { date: "2026-04-17", score: 92 },
  ],
  dimensionAverages: {
    clarity: 80,
    depth: 75,
    relevance: 82,
    communication: 76,
  },
  domainPerformance: [
    { domain: "Software Engineering", avgScore: 85, sessions: 8, color: "#3b82f6" },
    { domain: "System Design", avgScore: 72, sessions: 4, color: "#10b981" },
  ],
  recentSessions: [
    { id: "1", date: "2026-04-17", domain: "Software Engineering", score: 92, difficulty: "Mid" },
    { id: "2", date: "2026-04-16", domain: "Software Engineering", score: 85, difficulty: "Mid" },
    { id: "3", date: "2026-04-15", domain: "System Design", score: 88, difficulty: "Senior" },
  ],
};

const radarData = [
  { subject: "Clarity", A: 80, fullMark: 100 },
  { subject: "Technical Depth", A: 75, fullMark: 100 },
  { subject: "Relevance", A: 82, fullMark: 100 },
  { subject: "Communication", A: 76, fullMark: 100 },
];

const domains = [
  { id: "swe", name: "Software Engineering", icon: Code },
  { id: "pm", name: "Product Management", icon: Briefcase },
  { id: "ds", name: "Data Science", icon: Database },
];

const difficulties = ["Junior", "Mid", "Senior"];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [selectedDomain, setSelectedDomain] = useState("swe");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Mid");
  const [isLoading, setIsLoading] = useState(false);

  const startInterview = () => {
    setIsLoading(true);
    // Redirect to interview setup
    window.location.href = `/interview/setup?domain=${selectedDomain}&difficulty=${selectedDifficulty}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">IntervueAI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  {session?.user?.name || "User"}
                </span>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Good morning, {session?.user?.name || "User"}!</h1>
              <p className="text-blue-100 mt-1">Ready to practice? You're on a {mockStats.currentStreak}-day streak! 🔥</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{mockStats.currentStreak}</div>
              <div className="text-blue-200 text-sm">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalSessions}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+2 this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(mockStats.averageScore)}`}>
                    {mockStats.averageScore}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+5% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Best Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(mockStats.bestScore)}`}>
                    {mockStats.bestScore}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-gray-600">Personal best!</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Practice Time</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.floor(mockStats.totalPracticeMinutes / 60)}h {mockStats.totalPracticeMinutes % 60}m</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-gray-600">This week</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Score Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Your score improvement over the last 8 sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockStats.scoreHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis domain={[0, 100]} />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: '#1d4ed8' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Quick Start
                </CardTitle>
                <CardDescription>Start a new interview session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Domain</label>
                  <div className="flex gap-2">
                    {domains.map((domain) => (
                      <button
                        key={domain.id}
                        onClick={() => setSelectedDomain(domain.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                          selectedDomain === domain.id
                            ? "bg-blue-100 text-blue-800 border-2 border-blue-500"
                            : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                        }`}
                      >
                        <domain.icon className="h-4 w-4" />
                        {domain.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <div className="flex gap-2">
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                          selectedDifficulty === difficulty
                            ? "bg-green-100 text-green-800 border-2 border-green-500"
                            : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                        }`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={startInterview} disabled={isLoading} className="w-full" size="lg">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Starting...
                    </div>
                  ) : (
                    <>
                      Start Interview
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-600 text-center">
                  Estimated time: 15 minutes • 5 questions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Breakdown</CardTitle>
                <CardDescription>Your performance across key dimensions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Score"
                        dataKey="A"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>Your latest practice sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockStats.recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{session.domain}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(session.date).toLocaleDateString()} • {session.difficulty}
                      </p>
                    </div>
                    <Badge className={getScoreBadgeColor(session.score)}>
                      {session.score}%
                    </Badge>
                  </div>
                ))}
                <Link href="/history">
                  <Button variant="ghost" className="w-full mt-3">
                    View All Sessions
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Study Plan Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Today's Study Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm line-through text-gray-500">Review SOLID principles</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 border-2 border-gray-300 rounded" />
                  <span className="text-sm">Practice system design questions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 border-2 border-gray-300 rounded" />
                  <span className="text-sm">Mock interview session</span>
                </div>
                <Link href="/study-plan">
                  <Button variant="ghost" className="w-full mt-3">
                    View Full Plan
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