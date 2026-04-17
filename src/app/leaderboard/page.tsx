"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Calendar,
  Users,
  Brain,
  ArrowLeft,
  Crown
} from "lucide-react";

// Mock leaderboard data
const mockLeaderboard = {
  allTime: [
    { rank: 1, id: "1", name: "Alex Chen", displayName: "AI Enthusiast", domain: "Software Engineering", sessions: 45, averageScore: 91, bestScore: 98, streak: 12, change: 0 },
    { rank: 2, id: "2", name: "Sarah Johnson", displayName: "Code Ninja", domain: "Data Science", sessions: 38, averageScore: 89, bestScore: 96, streak: 8, change: 1 },
    { rank: 3, id: "3", name: "Mike Rodriguez", displayName: "System Architect", domain: "System Design", sessions: 42, averageScore: 87, bestScore: 94, streak: 15, change: -1 },
    { rank: 4, id: "4", name: "Emily Wang", displayName: "PM Pro", domain: "Product Management", sessions: 35, averageScore: 86, bestScore: 93, streak: 6, change: 2 },
    { rank: 5, id: "5", name: "David Kim", displayName: "Full Stack Dev", domain: "Software Engineering", sessions: 40, averageScore: 85, bestScore: 92, streak: 9, change: -1 },
    { rank: 6, id: "6", name: "Lisa Thompson", displayName: "Data Wizard", domain: "Data Science", sessions: 33, averageScore: 84, bestScore: 91, streak: 5, change: 0 },
    { rank: 7, id: "7", name: "John Miller", displayName: "Tech Lead", domain: "Software Engineering", sessions: 37, averageScore: 83, bestScore: 90, streak: 7, change: 1 },
    { rank: 8, id: "8", name: "Anna Davis", displayName: "Product Strategist", domain: "Product Management", sessions: 29, averageScore: 82, bestScore: 89, streak: 4, change: -2 },
    { rank: 9, id: "9", name: "Chris Wilson", displayName: "ML Engineer", domain: "Data Science", sessions: 31, averageScore: 81, bestScore: 88, streak: 3, change: 0 },
    { rank: 10, id: "10", name: "Jessica Brown", displayName: "Backend Developer", domain: "Software Engineering", sessions: 28, averageScore: 80, bestScore: 87, streak: 2, change: 1 },
  ],
  thisWeek: [
    { rank: 1, id: "3", name: "Mike Rodriguez", displayName: "System Architect", domain: "System Design", sessions: 8, averageScore: 89, bestScore: 94, streak: 15, change: 0 },
    { rank: 2, id: "1", name: "Alex Chen", displayName: "AI Enthusiast", domain: "Software Engineering", sessions: 7, averageScore: 87, bestScore: 92, streak: 12, change: 1 },
    { rank: 3, id: "5", name: "David Kim", displayName: "Full Stack Dev", domain: "Software Engineering", sessions: 6, averageScore: 86, bestScore: 90, streak: 9, change: -1 },
  ]
};

const currentUser = {
  id: "current",
  rank: 15,
  name: "You",
  displayName: "Rising Star",
  domain: "Software Engineering",
  sessions: 12,
  averageScore: 78,
  bestScore: 92,
  streak: 5
};

export default function LeaderboardPage() {
  const [selectedTab, setSelectedTab] = useState("alltime");
  const [selectedDomain, setSelectedDomain] = useState("all");

  const getLeaderboardData = () => {
    return selectedTab === "alltime" ? mockLeaderboard.allTime : mockLeaderboard.thisWeek;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-orange-500" />;
    return <span className="font-bold text-gray-600">#{rank}</span>;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="w-4 h-4" />;
  };

  const getDomainColor = (domain: string) => {
    const colors = {
      "Software Engineering": "bg-blue-100 text-blue-800",
      "Data Science": "bg-purple-100 text-purple-800",
      "Product Management": "bg-green-100 text-green-800",
      "System Design": "bg-orange-100 text-orange-800",
    };
    return colors[domain as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredData = getLeaderboardData().filter(user => 
    selectedDomain === "all" || user.domain === selectedDomain
  );

  const domains = ["all", ...Array.from(new Set(mockLeaderboard.allTime.map(u => u.domain)))];

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
                <h1 className="text-2xl font-bold text-gray-900">Community Leaderboard</h1>
                <p className="text-gray-600">See how you rank among other interview practitioners</p>
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
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-3">
            {/* Top 3 Podium */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Performers
                </CardTitle>
                <CardDescription>
                  The highest scoring practitioners this period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredData.slice(0, 3).map((user, index) => (
                    <div
                      key={user.id}
                      className={`text-center p-6 rounded-lg ${
                        index === 0 ? "bg-yellow-50 border-2 border-yellow-200" :
                        index === 1 ? "bg-gray-50 border-2 border-gray-200" :
                        "bg-orange-50 border-2 border-orange-200"
                      }`}
                    >
                      <div className="mb-4">
                        {getRankIcon(user.rank)}
                      </div>
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mx-auto mb-3">
                        {user.name.charAt(0)}
                      </div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{user.displayName}</p>
                      <Badge className={getDomainColor(user.domain)}>
                        {user.domain}
                      </Badge>
                      <div className="mt-3 space-y-1 text-sm">
                        <div><strong>{user.averageScore}%</strong> avg score</div>
                        <div><strong>{user.sessions}</strong> sessions</div>
                        <div><strong>{user.streak}</strong> day streak</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Full Leaderboard */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Full Rankings</CardTitle>
                  <div className="flex items-center space-x-4">
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      {domains.map(domain => (
                        <option key={domain} value={domain}>
                          {domain === "all" ? "All Domains" : domain}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="alltime">All Time</TabsTrigger>
                    <TabsTrigger value="thisweek">This Week</TabsTrigger>
                    <TabsTrigger value="bydomain">By Domain</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="alltime" className="mt-6">
                    <LeaderboardTable data={filteredData} />
                  </TabsContent>
                  
                  <TabsContent value="thisweek" className="mt-6">
                    <LeaderboardTable data={filteredData} />
                  </TabsContent>
                  
                  <TabsContent value="bydomain" className="mt-6">
                    <LeaderboardTable data={filteredData} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">#{currentUser.rank}</div>
                  <div className="text-sm text-blue-800">Current Rank</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Score:</span>
                    <span className="font-medium">{currentUser.averageScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Score:</span>
                    <span className="font-medium">{currentUser.bestScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sessions:</span>
                    <span className="font-medium">{currentUser.sessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Streak:</span>
                    <span className="font-medium">{currentUser.streak} days</span>
                  </div>
                </div>
                <Link href="/interview/setup">
                  <Button className="w-full mt-4">
                    Practice More
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">2,547</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sessions This Week:</span>
                    <span className="font-medium">1,284</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Score:</span>
                    <span className="font-medium">74%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Most Popular Domain:</span>
                    <span className="font-medium">Software Engineering</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">First Perfect Score!</p>
                    <p className="text-xs text-gray-600">You scored 100% on a session</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">5-Day Streak</p>
                    <p className="text-xs text-gray-600">Practiced 5 days in a row</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">10 Sessions Complete</p>
                    <p className="text-xs text-gray-600">Completed your first 10 sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderboardTable({ data }: { data: any[] }) {
  return (
    <div className="space-y-2">
      {data.map((user, index) => (
        <div
          key={user.id}
          className={`flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-gray-50 ${
            user.id === "current" ? "bg-blue-50 border-blue-200" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user.rank <= 3 ? (
                <div className="flex items-center">
                  {user.rank === 1 && <Crown className="h-5 w-5 text-yellow-500" />}
                  {user.rank === 2 && <Medal className="h-5 w-5 text-gray-400" />}
                  {user.rank === 3 && <Award className="h-5 w-5 text-orange-500" />}
                </div>
              ) : (
                <span className="font-bold text-gray-600 w-8">#{user.rank}</span>
              )}
              {user.change !== undefined && (
                <div className="flex items-center">
                  {user.change > 0 && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {user.change < 0 && <TrendingDown className="h-4 w-4 text-red-500" />}
                  {user.change !== 0 && (
                    <span className={`text-xs ml-1 ${user.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(user.change)}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.displayName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <Badge className={getDomainColor(user.domain)}>
              {user.domain}
            </Badge>
            <div className="text-center">
              <div className="font-medium">{user.sessions}</div>
              <div className="text-gray-600">sessions</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{user.averageScore}%</div>
              <div className="text-gray-600">avg</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{user.bestScore}%</div>
              <div className="text-gray-600">best</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{user.streak}</div>
              <div className="text-gray-600">streak</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getDomainColor(domain: string) {
  const colors = {
    "Software Engineering": "bg-blue-100 text-blue-800",
    "Data Science": "bg-purple-100 text-purple-800",
    "Product Management": "bg-green-100 text-green-800",
    "System Design": "bg-orange-100 text-orange-800",
  };
  return colors[domain as keyof typeof colors] || "bg-gray-100 text-gray-800";
}