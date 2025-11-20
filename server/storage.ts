import { eq, and, desc, sql } from "drizzle-orm";
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
  users,
  categories,
  habits,
  habitCompletions,
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
}

export const storage = new DatabaseStorage();
