CREATE TABLE `question_bank` (
	`id` text PRIMARY KEY NOT NULL,
	`domain` text NOT NULL,
	`difficulty` text NOT NULL,
	`question_text` text NOT NULL,
	`question_type` text NOT NULL,
	`topic` text NOT NULL,
	`sample_answer` text,
	`scoring_tips` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `question_bookmarks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`question_id` text NOT NULL,
	`bookmarked_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `question_bank`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`question_index` integer NOT NULL,
	`question_text` text NOT NULL,
	`question_type` text NOT NULL,
	`user_answer` text,
	`clarity_score` real DEFAULT 0,
	`depth_score` real DEFAULT 0,
	`relevance_score` real DEFAULT 0,
	`communication_score` real DEFAULT 0,
	`total_score` real DEFAULT 0,
	`feedback` text,
	`answered_at` text,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `resumes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`file_name` text,
	`skills` text,
	`experience` text,
	`projects` text,
	`education` text,
	`uploaded_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`domain` text NOT NULL,
	`difficulty` text NOT NULL,
	`question_count` integer NOT NULL,
	`use_resume` integer DEFAULT false,
	`status` text DEFAULT 'active' NOT NULL,
	`current_question_index` integer DEFAULT 0,
	`total_score` real DEFAULT 0,
	`started_at` text DEFAULT CURRENT_TIMESTAMP,
	`completed_at` text,
	`duration_minutes` integer DEFAULT 0,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `study_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`week_start` text NOT NULL,
	`week_end` text NOT NULL,
	`focus_areas` text,
	`tasks` text,
	`completed_tasks` text,
	`generated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_stats` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`total_sessions` integer DEFAULT 0,
	`total_practice_minutes` integer DEFAULT 0,
	`average_score` real DEFAULT 0,
	`best_score` real DEFAULT 0,
	`current_streak` integer DEFAULT 0,
	`last_activity_date` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`display_name` text,
	`target_role` text,
	`experience_level` text,
	`weekly_goal` integer DEFAULT 3,
	`onboarding_complete` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);