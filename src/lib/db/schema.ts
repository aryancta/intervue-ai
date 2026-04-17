import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  targetRole: text("target_role"),
  experienceLevel: text("experience_level"),
  weeklyGoal: integer("weekly_goal").default(3),
  onboardingComplete: integer("onboarding_complete", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Resume data table
export const resumes = sqliteTable("resumes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fileName: text("file_name"),
  skills: text("skills"), // JSON array
  experience: text("experience"), // JSON array
  projects: text("projects"), // JSON array
  education: text("education"), // JSON array
  uploadedAt: text("uploaded_at").default(sql`CURRENT_TIMESTAMP`),
});

// Interview sessions table
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  domain: text("domain").notNull(),
  difficulty: text("difficulty").notNull(),
  questionCount: integer("question_count").notNull(),
  useResume: integer("use_resume", { mode: "boolean" }).default(false),
  status: text("status").notNull().default("active"), // active, completed, abandoned
  currentQuestionIndex: integer("current_question_index").default(0),
  totalScore: real("total_score").default(0),
  startedAt: text("started_at").default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
  durationMinutes: integer("duration_minutes").default(0),
});

// Questions table
export const questions = sqliteTable("questions", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  questionIndex: integer("question_index").notNull(),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull(),
  userAnswer: text("user_answer"),
  clarityScore: real("clarity_score").default(0),
  depthScore: real("depth_score").default(0),
  relevanceScore: real("relevance_score").default(0),
  communicationScore: real("communication_score").default(0),
  totalScore: real("total_score").default(0),
  feedback: text("feedback"), // JSON object with dimension feedback
  answeredAt: text("answered_at"),
});

// Study plan table
export const studyPlans = sqliteTable("study_plans", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  weekStart: text("week_start").notNull(),
  weekEnd: text("week_end").notNull(),
  focusAreas: text("focus_areas"), // JSON array
  tasks: text("tasks"), // JSON array
  completedTasks: text("completed_tasks"), // JSON array of task IDs
  generatedAt: text("generated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Question bank table
export const questionBank = sqliteTable("question_bank", {
  id: text("id").primaryKey(),
  domain: text("domain").notNull(),
  difficulty: text("difficulty").notNull(),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull(),
  topic: text("topic").notNull(),
  sampleAnswer: text("sample_answer"),
  scoringTips: text("scoring_tips"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// User bookmarks for questions
export const questionBookmarks = sqliteTable("question_bookmarks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questionId: text("question_id").notNull().references(() => questionBank.id, { onDelete: "cascade" }),
  bookmarkedAt: text("bookmarked_at").default(sql`CURRENT_TIMESTAMP`),
});

// User stats table
export const userStats = sqliteTable("user_stats", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  totalSessions: integer("total_sessions").default(0),
  totalPracticeMinutes: integer("total_practice_minutes").default(0),
  averageScore: real("average_score").default(0),
  bestScore: real("best_score").default(0),
  currentStreak: integer("current_streak").default(0),
  lastActivityDate: text("last_activity_date"),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});