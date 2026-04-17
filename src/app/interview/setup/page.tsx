"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Code, 
  Briefcase, 
  Database, 
  GitBranch, 
  MessageSquare, 
  Building,
  Clock,
  Target,
  FileText,
  Play,
  Info,
  ChevronLeft,
  Lightbulb
} from "lucide-react";

const domains = [
  { 
    id: "swe", 
    name: "Software Engineering", 
    icon: Code, 
    description: "Algorithms, data structures, system design, coding best practices",
    color: "border-blue-500 bg-blue-50 text-blue-700"
  },
  { 
    id: "pm", 
    name: "Product Management", 
    icon: Briefcase, 
    description: "Product strategy, user research, metrics, stakeholder management",
    color: "border-green-500 bg-green-50 text-green-700"
  },
  { 
    id: "ds", 
    name: "Data Science", 
    icon: Database, 
    description: "Machine learning, statistics, data analysis, model deployment",
    color: "border-purple-500 bg-purple-50 text-purple-700"
  },
  { 
    id: "design", 
    name: "System Design", 
    icon: GitBranch, 
    description: "Architecture, scalability, distributed systems, trade-offs",
    color: "border-orange-500 bg-orange-50 text-orange-700"
  },
  { 
    id: "behavioral", 
    name: "Behavioral", 
    icon: MessageSquare, 
    description: "Leadership, teamwork, problem-solving, communication skills",
    color: "border-pink-500 bg-pink-50 text-pink-700"
  },
  { 
    id: "hr", 
    name: "HR", 
    icon: Building, 
    description: "General interview skills, company culture fit, career goals",
    color: "border-indigo-500 bg-indigo-50 text-indigo-700"
  }
];

const difficulties = [
  { 
    id: "junior", 
    name: "Junior", 
    description: "0-2 years experience",
    questions: "Fundamental concepts and basic problem-solving"
  },
  { 
    id: "mid", 
    name: "Mid-Level", 
    description: "2-5 years experience",
    questions: "Complex scenarios and advanced technical topics"
  },
  { 
    id: "senior", 
    name: "Senior", 
    description: "5+ years experience",
    questions: "Leadership, architecture, and strategic thinking"
  }
];

const questionCounts = [
  { count: 5, time: 15, description: "Quick practice session" },
  { count: 7, time: 20, description: "Standard interview length" },
  { count: 10, time: 30, description: "Comprehensive practice" }
];

const interviewTips = {
  swe: [
    "Think out loud while solving problems",
    "Ask clarifying questions before starting",
    "Consider edge cases and error handling",
    "Optimize your solution step by step"
  ],
  pm: [
    "Structure your answers using frameworks",
    "Provide specific metrics and examples",
    "Consider multiple stakeholders' perspectives",
    "Focus on user impact and business value"
  ],
  ds: [
    "Explain your thought process clearly",
    "Discuss data quality and assumptions",
    "Connect technical solutions to business outcomes",
    "Mention potential biases and limitations"
  ]
};

export default function InterviewSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDomain, setSelectedDomain] = useState(searchParams.get("domain") || "swe");
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get("difficulty") || "mid");
  const [questionCount, setQuestionCount] = useState(5);
  const [useResume, setUseResume] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const selectedDomainData = domains.find(d => d.id === selectedDomain);
  const selectedDifficultyData = difficulties.find(d => d.id === selectedDifficulty);
  const selectedQuestionData = questionCounts.find(q => q.count === questionCount);
  
  const tips = interviewTips[selectedDomain as keyof typeof interviewTips] || interviewTips.swe;

  const startInterview = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/sessions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: selectedDomain,
          difficulty: selectedDifficulty,
          questionCount,
          useResume,
        }),
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        router.push(`/interview/${sessionId}`);
      } else {
        console.error("Failed to create session");
      }
    } catch (error) {
      console.error("Error starting interview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Dashboard
                </Button>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Configure Your Interview</h1>
              <p className="text-gray-600">Customize your practice session</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Domain Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Interview Domain
                </CardTitle>
                <CardDescription>
                  Choose the area you want to practice. Each domain has specialized questions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domains.map((domain) => (
                    <div
                      key={domain.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedDomain === domain.id
                          ? domain.color
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedDomain(domain.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <domain.icon className="h-6 w-6 mt-1 text-gray-700" />
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{domain.name}</h3>
                          <p className="text-sm text-gray-600">{domain.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Difficulty Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Experience Level</CardTitle>
                <CardDescription>
                  Select the difficulty that matches your experience level.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {difficulties.map((difficulty) => (
                    <div
                      key={difficulty.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedDifficulty === difficulty.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedDifficulty(difficulty.id)}
                    >
                      <h3 className="font-semibold text-gray-900 mb-1">{difficulty.name}</h3>
                      <Badge variant="outline" className="mb-2">{difficulty.description}</Badge>
                      <p className="text-sm text-gray-600">{difficulty.questions}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Question Count */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Session Length
                </CardTitle>
                <CardDescription>
                  Choose how many questions you want to practice.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {questionCounts.map((option) => (
                    <div
                      key={option.count}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        questionCount === option.count
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setQuestionCount(option.count)}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{option.count}</div>
                        <div className="text-sm text-gray-600 mb-1">questions</div>
                        <Badge variant="outline" className="mb-2">~{option.time} min</Badge>
                        <p className="text-xs text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resume Alignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Personalization Options
                </CardTitle>
                <CardDescription>
                  Enhance your practice with personalized features.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="resume" 
                    checked={useResume}
                    onCheckedChange={(checked) => setUseResume(checked as boolean)}
                  />
                  <label 
                    htmlFor="resume" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Use my resume for personalized questions
                  </label>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {useResume 
                    ? "✓ Questions will reference your skills and experience from your uploaded resume"
                    : "Standard questions for the selected domain and difficulty"
                  }
                </p>
              </CardContent>
            </Card>

            {/* Start Button */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Ready to Start?</h3>
                    <p className="text-sm text-gray-600">
                      {selectedDomainData?.name} • {selectedDifficultyData?.name} • {questionCount} questions
                      {selectedQuestionData && ` • ~${selectedQuestionData.time} minutes`}
                    </p>
                  </div>
                  <Button 
                    onClick={startInterview} 
                    disabled={isLoading}
                    size="lg"
                    className="min-w-[140px]"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Starting...
                      </div>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Interview
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Interview Tips
                </CardTitle>
                <CardDescription>
                  Best practices for {selectedDomainData?.name.toLowerCase()} interviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <p className="text-sm text-gray-700">Questions adapted to your experience level</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <p className="text-sm text-gray-700">Immediate feedback after each answer</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                    <p className="text-sm text-gray-700">Follow-up questions for deeper practice</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
                    <p className="text-sm text-gray-700">Detailed scoring on 4 key dimensions</p>
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