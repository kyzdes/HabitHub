import { eq, and, desc, sql, inArray } from "drizzle-orm";
import { db } from "./db";
import {
  type User,
  type UserPublic,
  type InsertUser,
  type Category,
  type InsertCategory,
  type UpdateCategory,
  type Habit,
  type InsertHabit,
  type UpdateHabit,
  type HabitCompletion,
  type InsertHabitCompletion,
  type UserProfile,
  type InsertUserProfile,
  type UpdateUserProfile,
  type Achievement,
  type UserAchievement,
  type InsertUserAchievement,
  type HabitTemplate,
  type HabitJournal,
  type InsertHabitJournal,
  type Milestone,
  type InsertMilestone,
  type HabitReminder,
  type InsertHabitReminder,
  users,
  categories,
  habits,
  habitCompletions,
  userProfiles,
  achievements,
  userAchievements,
  habitTemplates,
  habitJournals,
  milestones,
  habitReminders,
} from "@shared/schema";
import bcrypt from "bcryptjs";

// Database storage implementation
export class DatabaseStorage {
  // User operations
  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(userData: InsertUser & { password?: string }): Promise<UserPublic> {
    let hashedPassword: string | null = null;

    if (userData.password) {
      hashedPassword = await bcrypt.hash(userData.password, 10);
    }

    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
      })
      .returning();

    return this.sanitizeUser(user);
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<UserPublic | undefined> {
    const [user] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return user ? this.sanitizeUser(user) : undefined;
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  sanitizeUser(user: User): UserPublic {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Category operations
  async getCategoriesByUserId(userId: string): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId))
      .orderBy(categories.order);
  }

  async getCategoryById(id: string, userId: string): Promise<Category | undefined> {
    const result = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .limit(1);
    return result[0];
  }

  async createCategory(categoryData: InsertCategory & { userId: string }): Promise<Category> {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }

  async updateCategory(
    id: string,
    userId: string,
    categoryData: UpdateCategory
  ): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set({
        ...categoryData,
        updatedAt: new Date(),
      })
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning();
    return category;
  }

  async deleteCategory(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Habit operations
  async getHabitsByUserId(userId: string, includeArchived = false): Promise<Habit[]> {
    const query = db
      .select()
      .from(habits)
      .where(
        includeArchived
          ? eq(habits.userId, userId)
          : and(eq(habits.userId, userId), eq(habits.archived, false))
      )
      .orderBy(habits.order);

    return await query;
  }

  async getHabitById(id: string, userId: string): Promise<Habit | undefined> {
    const result = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, id), eq(habits.userId, userId)))
      .limit(1);
    return result[0];
  }

  async createHabit(habitData: InsertHabit & { userId: string }): Promise<Habit> {
    const [habit] = await db.insert(habits).values(habitData).returning();
    return habit;
  }

  async updateHabit(
    id: string,
    userId: string,
    habitData: UpdateHabit
  ): Promise<Habit | undefined> {
    const [habit] = await db
      .update(habits)
      .set({
        ...habitData,
        updatedAt: new Date(),
      })
      .where(and(eq(habits.id, id), eq(habits.userId, userId)))
      .returning();
    return habit;
  }

  async deleteHabit(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(habits)
      .where(and(eq(habits.id, id), eq(habits.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async archiveHabit(id: string, userId: string): Promise<Habit | undefined> {
    return this.updateHabit(id, userId, { archived: true });
  }

  async unarchiveHabit(id: string, userId: string): Promise<Habit | undefined> {
    return this.updateHabit(id, userId, { archived: false });
  }

  // Habit completion operations
  async getCompletionsByHabitId(
    habitId: string,
    userId: string,
    limit?: number
  ): Promise<HabitCompletion[]> {
    let query = db
      .select()
      .from(habitCompletions)
      .where(and(eq(habitCompletions.habitId, habitId), eq(habitCompletions.userId, userId)))
      .orderBy(desc(habitCompletions.completedDate));

    if (limit) {
      query = query.limit(limit);
    }

    return await query;
  }

  async getCompletionsByUserId(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<HabitCompletion[]> {
    let conditions = [eq(habitCompletions.userId, userId)];

    if (startDate) {
      conditions.push(sql`${habitCompletions.completedDate} >= ${startDate.toISOString().split('T')[0]}`);
    }
    if (endDate) {
      conditions.push(sql`${habitCompletions.completedDate} <= ${endDate.toISOString().split('T')[0]}`);
    }

    return await db
      .select()
      .from(habitCompletions)
      .where(and(...conditions))
      .orderBy(desc(habitCompletions.completedDate));
  }

  async createCompletion(
    completionData: InsertHabitCompletion & { userId: string }
  ): Promise<HabitCompletion> {
    const [completion] = await db.insert(habitCompletions).values(completionData).returning();
    return completion;
  }

  async deleteCompletion(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(habitCompletions)
      .where(and(eq(habitCompletions.id, id), eq(habitCompletions.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async getCompletionByHabitAndDate(
    habitId: string,
    userId: string,
    date: string
  ): Promise<HabitCompletion | undefined> {
    const result = await db
      .select()
      .from(habitCompletions)
      .where(
        and(
          eq(habitCompletions.habitId, habitId),
          eq(habitCompletions.userId, userId),
          eq(habitCompletions.completedDate, date)
        )
      )
      .limit(1);
    return result[0];
  }

  // Statistics
  async getUserStats(userId: string, days: number = 30): Promise<{
    totalHabits: number;
    activeHabits: number;
    completionsLast30Days: number;
    currentStreak: number;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days);
    const dateStr = thirtyDaysAgo.toISOString().split('T')[0];

    const [totalHabitsResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(habits)
      .where(eq(habits.userId, userId));

    const [activeHabitsResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(habits)
      .where(and(eq(habits.userId, userId), eq(habits.archived, false)));

    const [completionsResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(habitCompletions)
      .where(
        and(
          eq(habitCompletions.userId, userId),
          sql`${habitCompletions.completedDate} >= ${dateStr}`
        )
      );

    // Calculate streak (simplified - you may want to enhance this)
    const recentCompletions = await db
      .select()
      .from(habitCompletions)
      .where(eq(habitCompletions.userId, userId))
      .orderBy(desc(habitCompletions.completedDate))
      .limit(100);

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const uniqueDates = [...new Set(recentCompletions.map(c => c.completedDate))].sort().reverse();

    if (uniqueDates.length > 0 && (uniqueDates[0] === today || uniqueDates[0] === yesterdayStr)) {
      for (let i = 0; i < uniqueDates.length; i++) {
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - i);
        const expectedDateStr = expectedDate.toISOString().split('T')[0];

        if (uniqueDates[i] === expectedDateStr) {
          streak++;
        } else {
          break;
        }
      }
    }

    return {
      totalHabits: totalHabitsResult.count,
      activeHabits: activeHabitsResult.count,
      completionsLast30Days: completionsResult.count,
      currentStreak: streak,
    };
  }

  // ===== V2.0 GAMIFICATION METHODS =====

  // User Profile operations (XP, Levels, Streaks)
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const result = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (result[0]) {
      return result[0];
    }

    // Create default profile if doesn't exist
    const [newProfile] = await db
      .insert(userProfiles)
      .values({ userId })
      .returning();
    return newProfile;
  }

  async updateUserProfile(
    userId: string,
    profileData: UpdateUserProfile
  ): Promise<UserProfile | undefined> {
    const [profile] = await db
      .update(userProfiles)
      .set({
        ...profileData,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return profile;
  }

  // XP and level management
  async addXP(userId: string, amount: number): Promise<{
    profile: UserProfile;
    leveledUp: boolean;
    newLevel?: number;
  }> {
    const profile = await this.getUserProfile(userId);
    if (!profile) {
      throw new Error("User profile not found");
    }

    const newXp = profile.xp + amount;
    const newTotalXp = profile.totalXp + amount;
    const newLevel = this.calculateLevel(newTotalXp);
    const leveledUp = newLevel > profile.level;

    const updatedProfile = await this.updateUserProfile(userId, {
      xp: newLevel > profile.level ? newXp - this.getLevelRequirement(newLevel) : newXp,
      totalXp: newTotalXp,
      level: newLevel,
    });

    return {
      profile: updatedProfile!,
      leveledUp,
      newLevel: leveledUp ? newLevel : undefined,
    };
  }

  // Calculate level from total XP
  calculateLevel(totalXp: number): number {
    // Formula: level = floor(sqrt(totalXp / 100)) + 1
    // Level 1: 0-99 XP
    // Level 2: 100-399 XP
    // Level 3: 400-899 XP
    // Level 5: 1600-2499 XP
    // Level 10: 8100-12099 XP
    // Level 25: 57600-67599 XP
    // Level 50: 240100-260099 XP
    return Math.floor(Math.sqrt(totalXp / 100)) + 1;
  }

  // Get XP required for a specific level
  getLevelRequirement(level: number): number {
    // Inverse of calculateLevel formula
    return (level - 1) ** 2 * 100;
  }

  // Achievement operations
  async getAchievements(): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .orderBy(achievements.category, achievements.order);
  }

  async getAchievementByKey(key: string): Promise<Achievement | undefined> {
    const result = await db
      .select()
      .from(achievements)
      .where(eq(achievements.key, key))
      .limit(1);
    return result[0];
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const result = await db
      .select({
        userAchievement: userAchievements,
        achievement: achievements,
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.unlockedAt));

    return result.map(r => ({
      ...r.userAchievement,
      achievement: r.achievement,
    }));
  }

  async unlockAchievement(userId: string, achievementKey: string): Promise<UserAchievement | null> {
    const achievement = await this.getAchievementByKey(achievementKey);
    if (!achievement) {
      return null;
    }

    // Check if already unlocked
    const existing = await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementId, achievement.id)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    // Unlock achievement
    const [unlocked] = await db
      .insert(userAchievements)
      .values({
        userId,
        achievementId: achievement.id,
      })
      .returning();

    // Add XP reward
    await this.addXP(userId, achievement.xpReward);

    return unlocked;
  }

  async checkAchievements(userId: string): Promise<UserAchievement[]> {
    // Get user stats
    const profile = await this.getUserProfile(userId);
    const stats = await this.getUserStats(userId);
    const allAchievements = await this.getAchievements();
    const userUnlocked = await this.getUserAchievements(userId);
    const unlockedKeys = new Set(userUnlocked.map(ua => ua.achievement.key));

    const newlyUnlocked: UserAchievement[] = [];

    for (const achievement of allAchievements) {
      if (unlockedKeys.has(achievement.key)) {
        continue; // Already unlocked
      }

      const req = achievement.requirement as any;
      let shouldUnlock = false;

      switch (req.type) {
        case "habits_created":
          shouldUnlock = stats.totalHabits >= req.value;
          break;
        case "completions":
        case "total_completions":
          shouldUnlock = profile!.totalCompletions >= req.value;
          break;
        case "streak":
          shouldUnlock = profile!.currentStreak >= req.value || profile!.longestStreak >= req.value;
          break;
        case "level":
          shouldUnlock = profile!.level >= req.value;
          break;
        case "categories_created":
          const categories = await this.getCategoriesByUserId(userId);
          shouldUnlock = categories.length >= req.value;
          break;
        case "perfect_day":
          shouldUnlock = profile!.perfectDays >= req.value;
          break;
        // Add more achievement types as needed
      }

      if (shouldUnlock) {
        const unlocked = await this.unlockAchievement(userId, achievement.key);
        if (unlocked) {
          newlyUnlocked.push(unlocked);
        }
      }
    }

    return newlyUnlocked;
  }

  // Template operations
  async getTemplates(category?: string): Promise<HabitTemplate[]> {
    if (category) {
      return await db
        .select()
        .from(habitTemplates)
        .where(eq(habitTemplates.category, category))
        .orderBy(desc(habitTemplates.featured), desc(habitTemplates.popularity));
    }

    return await db
      .select()
      .from(habitTemplates)
      .orderBy(desc(habitTemplates.featured), desc(habitTemplates.popularity));
  }

  async getTemplateById(id: string): Promise<HabitTemplate | undefined> {
    const result = await db
      .select()
      .from(habitTemplates)
      .where(eq(habitTemplates.id, id))
      .limit(1);
    return result[0];
  }

  async createHabitFromTemplate(userId: string, templateId: string): Promise<Habit> {
    const template = await this.getTemplateById(templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    // Create habit from template
    const habit = await this.createHabit({
      userId,
      name: template.name,
      description: template.description || "",
      frequency: template.frequency,
      targetCount: template.targetCount,
      icon: template.icon || "star",
      color: template.color || "#3B82F6",
      archived: false,
      order: 0, // Will be reordered by frontend
    });

    // Increment template popularity
    await db
      .update(habitTemplates)
      .set({
        popularity: template.popularity + 1,
      })
      .where(eq(habitTemplates.id, templateId));

    return habit;
  }

  // Journal operations
  async createJournalEntry(journalData: InsertHabitJournal): Promise<HabitJournal> {
    const [journal] = await db
      .insert(habitJournals)
      .values(journalData)
      .returning();
    return journal;
  }

  async getJournalsByCompletion(completionId: string): Promise<HabitJournal[]> {
    return await db
      .select()
      .from(habitJournals)
      .where(eq(habitJournals.completionId, completionId));
  }

  async getJournalsByUser(userId: string, limit?: number): Promise<HabitJournal[]> {
    let query = db
      .select()
      .from(habitJournals)
      .where(eq(habitJournals.userId, userId))
      .orderBy(desc(habitJournals.createdAt));

    if (limit) {
      query = query.limit(limit);
    }

    return await query;
  }

  // Milestone operations
  async createMilestone(milestoneData: InsertMilestone): Promise<Milestone> {
    const [milestone] = await db
      .insert(milestones)
      .values(milestoneData)
      .returning();
    return milestone;
  }

  async getMilestonesByUser(userId: string): Promise<Milestone[]> {
    return await db
      .select()
      .from(milestones)
      .where(eq(milestones.userId, userId))
      .orderBy(desc(milestones.achievedAt));
  }

  // Reminder operations
  async createReminder(reminderData: InsertHabitReminder): Promise<HabitReminder> {
    const [reminder] = await db
      .insert(habitReminders)
      .values(reminderData)
      .returning();
    return reminder;
  }

  async getRemindersByUser(userId: string): Promise<HabitReminder[]> {
    return await db
      .select()
      .from(habitReminders)
      .where(and(eq(habitReminders.userId, userId), eq(habitReminders.enabled, true)))
      .orderBy(habitReminders.time);
  }

  async getRemindersByHabit(habitId: string): Promise<HabitReminder[]> {
    return await db
      .select()
      .from(habitReminders)
      .where(eq(habitReminders.habitId, habitId));
  }

  async updateReminder(
    id: string,
    userId: string,
    reminderData: Partial<InsertHabitReminder>
  ): Promise<HabitReminder | undefined> {
    const [reminder] = await db
      .update(habitReminders)
      .set(reminderData)
      .where(and(eq(habitReminders.id, id), eq(habitReminders.userId, userId)))
      .returning();
    return reminder;
  }

  async deleteReminder(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(habitReminders)
      .where(and(eq(habitReminders.id, id), eq(habitReminders.userId, userId)))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
