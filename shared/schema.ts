import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  date,
  uuid,
  unique
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }), // hashed password, nullable for OAuth users
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  provider: varchar("provider", { length: 50 }).default("local"), // local, google, etc.
  providerId: varchar("provider_id", { length: 255 }), // OAuth provider user ID
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(), // hex color code
  icon: varchar("icon", { length: 50 }), // lucide icon name
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_categories_user_id").on(table.userId),
  unique("unique_category_name_per_user").on(table.userId, table.name)
]);

// Habits table
export const habits = pgTable("habits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }), // lucide icon name
  color: varchar("color", { length: 7 }), // hex color code
  frequency: varchar("frequency", { length: 20 }).default("daily").notNull(), // daily, weekly, custom
  targetDays: jsonb("target_days").default(sql`'[1,2,3,4,5,6,0]'::jsonb`), // days of week for weekly habits
  targetCount: integer("target_count").default(1), // times per day/week
  reminderTime: varchar("reminder_time", { length: 5 }), // HH:MM format
  reminderEnabled: boolean("reminder_enabled").default(false),
  order: integer("order").default(0).notNull(),
  archived: boolean("archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_habits_user_id").on(table.userId),
  index("idx_habits_category_id").on(table.categoryId),
  index("idx_habits_archived").on(table.archived)
]);

// Habit completions table
export const habitCompletions = pgTable("habit_completions", {
  id: uuid("id").primaryKey().defaultRandom(),
  habitId: uuid("habit_id").references(() => habits.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  completedDate: date("completed_date").notNull(), // for querying by date
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_completions_habit_id").on(table.habitId),
  index("idx_completions_user_id").on(table.userId),
  index("idx_completions_date").on(table.completedDate),
  unique("unique_habit_completion_per_day").on(table.habitId, table.completedDate)
]);

// ===== V2.0 FEATURES =====

// User profile extensions for gamification
export const userProfiles = pgTable("user_profiles", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  level: integer("level").default(1).notNull(),
  xp: integer("xp").default(0).notNull(),
  totalXp: integer("total_xp").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  streakFreezes: integer("streak_freezes").default(3).notNull(), // saves for missed days
  totalCompletions: integer("total_completions").default(0).notNull(),
  perfectDays: integer("perfect_days").default(0).notNull(), // days with all habits complete
  theme: varchar("theme", { length: 50 }).default("default"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Achievements system
export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 100 }).unique().notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  rarity: varchar("rarity", { length: 20 }).default("common").notNull(), // common, rare, epic, legendary
  category: varchar("category", { length: 50 }).notNull(),
  xpReward: integer("xp_reward").default(50).notNull(),
  requirement: jsonb("requirement").notNull(), // {type: "streak", value: 7}
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User achievement unlocks
export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  achievementId: uuid("achievement_id").references(() => achievements.id, { onDelete: "cascade" }).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
  progress: integer("progress").default(0),
  seen: boolean("seen").default(false).notNull(), // for notification
}, (table) => [
  index("idx_user_achievements_user").on(table.userId),
  unique("unique_user_achievement").on(table.userId, table.achievementId)
]);

// Habit templates for quick habit creation
export const habitTemplates = pgTable("habit_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(), // Morning, Health, Productivity, etc
  icon: varchar("icon", { length: 50 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
  frequency: varchar("frequency", { length: 20 }).default("daily").notNull(),
  targetCount: integer("target_count").default(1).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).default("medium"), // easy, medium, hard
  tags: jsonb("tags"), // ["fitness", "morning", "quick"]
  timeSuggestion: varchar("time_suggestion", { length: 50 }), // "morning", "evening", "anytime"
  estimatedMinutes: integer("estimated_minutes"), // time to complete
  popularity: integer("popularity").default(0), // usage count
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Habit journal entries (enhanced completions)
export const habitJournals = pgTable("habit_journals", {
  id: uuid("id").primaryKey().defaultRandom(),
  completionId: uuid("completion_id").references(() => habitCompletions.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  mood: varchar("mood", { length: 20 }), // happy, neutral, sad, stressed, energized
  energy: integer("energy"), // 1-5 scale
  difficulty: integer("difficulty"), // 1-5 how hard was it
  notes: text("notes"),
  reflection: text("reflection"),
  tags: jsonb("tags"), // custom tags
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_journal_user").on(table.userId),
  index("idx_journal_completion").on(table.completionId)
]);

// Milestones for tracking important events
export const milestones = pgTable("milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // streak, completion_count, level_up, perfect_week
  habitId: uuid("habit_id").references(() => habits.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  value: integer("value").notNull(), // the milestone number (e.g., 30 for 30-day streak)
  icon: varchar("icon", { length: 50 }),
  achievedAt: timestamp("achieved_at").defaultNow().notNull(),
  celebrated: boolean("celebrated").default(false), // shown confetti
}, (table) => [
  index("idx_milestones_user").on(table.userId),
  index("idx_milestones_habit").on(table.habitId)
]);

// Habit reminders
export const habitReminders = pgTable("habit_reminders", {
  id: uuid("id").primaryKey().defaultRandom(),
  habitId: uuid("habit_id").references(() => habits.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  time: varchar("time", { length: 5 }).notNull(), // HH:MM format
  days: jsonb("days").notNull(), // [0,1,2,3,4,5,6] for days of week
  enabled: boolean("enabled").default(true).notNull(),
  message: text("message"), // custom reminder text
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_reminders_habit").on(table.habitId),
  index("idx_reminders_user").on(table.userId)
]);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  categories: many(categories),
  habits: many(habits),
  completions: many(habitCompletions),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  habits: many(habits),
}));

export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [habits.categoryId],
    references: [categories.id],
  }),
  completions: many(habitCompletions),
}));

export const habitCompletionsRelations = relations(habitCompletions, ({ one }) => ({
  habit: one(habits, {
    fields: [habitCompletions.habitId],
    references: [habits.id],
  }),
  user: one(users, {
    fields: [habitCompletions.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  emailVerified: true,
});

export const selectUserSchema = createSelectSchema(users);

export const insertCategorySchema = createInsertSchema(categories, {
  name: z.string().min(1, "Category name is required").max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  icon: z.string().optional(),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCategorySchema = insertCategorySchema.partial();

export const insertHabitSchema = createInsertSchema(habits, {
  name: z.string().min(1, "Habit name is required").max(200),
  description: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "custom"]),
  targetCount: z.number().int().min(1).optional(),
  reminderTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateHabitSchema = insertHabitSchema.partial();

export const insertHabitCompletionSchema = createInsertSchema(habitCompletions, {
  notes: z.string().max(1000).optional(),
}).omit({
  id: true,
  userId: true,
  completedAt: true,
  createdAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;

export type Habit = typeof habits.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type UpdateHabit = z.infer<typeof updateHabitSchema>;

export type HabitCompletion = typeof habitCompletions.$inferSelect;
export type InsertHabitCompletion = z.infer<typeof insertHabitCompletionSchema>;

// ===== V2.0 ZOD SCHEMAS =====

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  userId: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertHabitTemplateSchema = createInsertSchema(habitTemplates, {
  name: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
}).omit({
  id: true,
  createdAt: true,
});

export const insertHabitJournalSchema = createInsertSchema(habitJournals, {
  mood: z.enum(["happy", "neutral", "sad", "stressed", "energized", "calm", "anxious"]).optional(),
  energy: z.number().int().min(1).max(5).optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(2000).optional(),
  reflection: z.string().max(2000).optional(),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
  userId: true,
  achievedAt: true,
});

export const insertReminderSchema = createInsertSchema(habitReminders, {
  time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
});

// ===== V2.0 TYPE EXPORTS =====

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

export type HabitTemplate = typeof habitTemplates.$inferSelect;
export type InsertHabitTemplate = z.infer<typeof insertHabitTemplateSchema>;

export type HabitJournal = typeof habitJournals.$inferSelect;
export type InsertHabitJournal = z.infer<typeof insertHabitJournalSchema>;

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;

export type HabitReminder = typeof habitReminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;

// Utility types for API responses
export type UserPublic = Omit<User, "password">;
export type HabitWithCategory = Habit & { category: Category | null };
export type HabitWithCompletions = Habit & { completions: HabitCompletion[] };
export type UserWithProfile = UserPublic & { profile: UserProfile | null };
export type AchievementWithProgress = Achievement & { progress?: number; unlocked?: boolean; unlockedAt?: string };
export type HabitWithJournal = Habit & { journal?: HabitJournal };
