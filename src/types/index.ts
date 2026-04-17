export interface User {
  id: string;
  name: string;
  email: string;
  displayName?: string;
  targetRole?: string;
  experienceLevel?: string;
  weeklyGoal?: number;
  onboardingComplete: boolean;
  createdAt: string;
}

export interface ResumeData {
  skills: string[];
  experience: {
    company: string;
    role: string;
    duration: string;
    bullets: string[];
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
}

export interface InterviewSession {
  id: string;
  userId: string;
  domain: string;
  difficulty: string;
  questionCount: number;
  useResume: boolean;
  status: "active" | "completed" | "abandoned";
  currentQuestionIndex: number;
  totalScore: number;
  startedAt: string;
  completedAt?: string;
  durationMinutes: number;
}

export interface Question {
  id: string;
  sessionId: string;
  questionIndex: number;
  questionText: string;
  questionType: string;
  userAnswer?: string;
  clarityScore: number;
  depthScore: number;
  relevanceScore: number;
  communicationScore: number;
  totalScore: number;
  feedback?: {
    clarity: { score: number; tip: string };
    depth: { score: number; tip: string };
    relevance: { score: number; tip: string };
    communication: { score: number; tip: string };
    overallFeedback: string;
  };
  answeredAt?: string;
}

export interface StudyPlan {
  id: string;
  userId: string;
  weekStart: string;
  weekEnd: string;
  focusAreas: {
    dimension: string;
    score: number;
    tips: string[];
  }[];
  tasks: {
    id: string;
    topic: string;
    description: string;
    estimatedTime: number;
    resourceType: string;
    resourceUrl?: string;
    day: number; // 0-6 for days of week
  }[];
  completedTasks: string[];
  generatedAt: string;
}

export interface QuestionBankItem {
  id: string;
  domain: string;
  difficulty: string;
  questionText: string;
  questionType: string;
  topic: string;
  sampleAnswer?: string;
  scoringTips?: string;
  isBookmarked?: boolean;
}

export interface UserStats {
  totalSessions: number;
  totalPracticeMinutes: number;
  averageScore: number;
  bestScore: number;
  currentStreak: number;
  lastActivityDate?: string;
  scoreHistory: { date: string; score: number }[];
  dimensionAverages: {
    clarity: number;
    depth: number;
    relevance: number;
    communication: number;
  };
  domainPerformance: {
    domain: string;
    avgScore: number;
    sessions: number;
  }[];
  activityHeatmap: { date: string; count: number }[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  displayName?: string;
  domain: string;
  sessions: number;
  averageScore: number;
  bestScore: number;
  currentStreak: number;
  rankChange?: number;
}