"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Filter, 
  Search, 
  Eye, 
  RotateCcw, 
  Trash2, 
  Clock,
  Target,
  TrendingUp,
  Brain,
  ArrowLeft
} from "lucide-react";

// Mock data - in a real app this would come from your API
const mockSessions = [
  {
    id: "1",
    date: "2026-04-17",
    domain: "Software Engineering",
    difficulty: "Mid",
    score: 92,
    duration: 18,
    questionCount: 5,
    status: "completed"
  },
  {
    id: "2",
    date: "2026-04-16",
    domain: "Software Engineering",
    difficulty: "Mid",
    score: 85,
    duration: 15,
    questionCount: 5,
    status: "completed"
  },
  {
    id: "3",
    date: "2026-04-15",
    domain: "System Design",
    difficulty: "Senior",
    score: 88,
    duration: 25,
    questionCount: 7,
    status: "completed"
  },
  {
    id: "4",
    date: "2026-04-14",
    domain: "Software Engineering",
    difficulty: "Mid",
    score: 75,
    duration: 12,
    questionCount: 5,
    status: "completed"
  },
  {
    id: "5",
    date: "2026-04-13",
    domain: "Product Management",
    difficulty: "Mid",
    score: 78,
    duration: 20,
    questionCount: 7,
    status: "completed"
  },
];

export default function HistoryPage() {
  const [sessions, setSessions] = useState(mockSessions);
  const [filteredSessions, setFilteredSessions] = useState(mockSessions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [minScore, setMinScore] = useState(0);

  const domains = ["all", ...Array.from(new Set(sessions.map(s => s.domain)))];

  useEffect(() => {
    let filtered = sessions.filter(session => {
      const matchesSearch = session.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.difficulty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = selectedDomain === "all" || session.domain === selectedDomain;
      const matchesScore = session.score >= minScore;
      
      return matchesSearch && matchesDomain && matchesScore;
    });
    
    setFilteredSessions(filtered);
  }, [searchTerm, selectedDomain, minScore, sessions]);

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getDomainIcon = (domain: string) => {
    // You could add specific icons for each domain
    return <Target className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const deleteSession = (sessionId: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      setSessions(sessions.filter(s => s.id !== sessionId));
    }
  };

  const averageScore = Math.round(
    filteredSessions.reduce((sum, s) => sum + s.score, 0) / filteredSessions.length
  );

  const totalPracticeTime = filteredSessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Session History</h1>
                <p className="text-gray-600">Review your past interview practice sessions</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="font-semibold text-gray-900">IntervueAI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredSessions.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{averageScore || 0}%</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Practice Time</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.floor(totalPracticeTime / 60)}h {totalPracticeTime % 60}m</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Best Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.max(...filteredSessions.map(s => s.score)) || 0}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search domain, difficulty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain
                </label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {domains.map(domain => (
                    <option key={domain} value={domain}>
                      {domain === "all" ? "All Domains" : domain}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Score
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDomain("all");
                    setMinScore(0);
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
              <p className="text-gray-600 mb-6">
                {sessions.length === 0 
                  ? "You haven't completed any interview sessions yet."
                  : "No sessions match your current filters."
                }
              </p>
              <Link href="/interview/setup">
                <Button>Start Your First Interview</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getDomainIcon(session.domain)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{session.domain}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{formatDate(session.date)}</span>
                          <Badge variant="outline">{session.difficulty}</Badge>
                          <span>{session.duration} minutes</span>
                          <span>{session.questionCount} questions</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge className={getScoreBadgeColor(session.score)}>
                        {session.score}%
                      </Badge>
                      
                      <div className="flex items-center space-x-2">
                        <Link href={`/history/${session.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </Link>
                        <Link href={`/interview/setup?domain=${session.domain}&difficulty=${session.difficulty}`}>
                          <Button variant="outline" size="sm">
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Retry
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteSession(session.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}