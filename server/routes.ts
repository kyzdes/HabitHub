import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import {
  insertCategorySchema,
  updateCategorySchema,
  insertHabitSchema,
  updateHabitSchema,
  insertHabitCompletionSchema,
  updateUserProfileSchema,
  insertHabitJournalSchema,
  insertMilestoneSchema,
  insertHabitReminderSchema,
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  await setupAuth(app);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ========== CATEGORY ROUTES ==========

  // Get all categories for the current user
  app.get("/api/categories", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const categories = await storage.getCategoriesByUserId(userId);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Create a new category
  app.post("/api/categories", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validation = insertCategorySchema.safeParse(req.body);

      if (!validation.success) {
        const error = fromZodError(validation.error);
        return res.status(400).json({ message: error.message });
      }

      const category = await storage.createCategory({
        ...validation.data,
        userId,
      });

      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating category:", error);
      if (error.code === "23505") {
        // Unique constraint violation
        return res.status(400).json({ message: "Category name already exists" });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Update a category
  app.put("/api/categories/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const validation = updateCategorySchema.safeParse(req.body);

      if (!validation.success) {
        const error = fromZodError(validation.error);
        return res.status(400).json({ message: error.message });
      }

      const category = await storage.updateCategory(id, userId, validation.data);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error: any) {
      console.error("Error updating category:", error);
      if (error.code === "23505") {
        return res.status(400).json({ message: "Category name already exists" });
      }
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  // Delete a category
  app.delete("/api/categories/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const deleted = await storage.deleteCategory(id, userId);

      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // ========== HABIT ROUTES ==========

  // Get all habits for the current user
  app.get("/api/habits", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const includeArchived = req.query.archived === "true";
      const habits = await storage.getHabitsByUserId(userId, includeArchived);
      res.json(habits);
    } catch (error) {
      console.error("Error fetching habits:", error);
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });

  // Get a single habit
  app.get("/api/habits/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const habit = await storage.getHabitById(id, userId);

      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }

      res.json(habit);
    } catch (error) {
      console.error("Error fetching habit:", error);
      res.status(500).json({ message: "Failed to fetch habit" });
    }
  });

  // Create a new habit
  app.post("/api/habits", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validation = insertHabitSchema.safeParse(req.body);

      if (!validation.success) {
        const error = fromZodError(validation.error);
        return res.status(400).json({ message: error.message });
      }

      const habit = await storage.createHabit({
        ...validation.data,
        userId,
      });

      res.status(201).json(habit);
    } catch (error) {
      console.error("Error creating habit:", error);
      res.status(500).json({ message: "Failed to create habit" });
    }
  });

  // Update a habit
  app.put("/api/habits/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const validation = updateHabitSchema.safeParse(req.body);

      if (!validation.success) {
        const error = fromZodError(validation.error);
        return res.status(400).json({ message: error.message });
      }

      const habit = await storage.updateHabit(id, userId, validation.data);

      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }

      res.json(habit);
    } catch (error) {
      console.error("Error updating habit:", error);
      res.status(500).json({ message: "Failed to update habit" });
    }
  });

  // Delete a habit
  app.delete("/api/habits/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const deleted = await storage.deleteHabit(id, userId);

      if (!deleted) {
        return res.status(404).json({ message: "Habit not found" });
      }

      res.json({ message: "Habit deleted successfully" });
    } catch (error) {
      console.error("Error deleting habit:", error);
      res.status(500).json({ message: "Failed to delete habit" });
    }
  });

  // Archive a habit
  app.post("/api/habits/:id/archive", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const habit = await storage.archiveHabit(id, userId);

      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }

      res.json(habit);
    } catch (error) {
      console.error("Error archiving habit:", error);
      res.status(500).json({ message: "Failed to archive habit" });
    }
  });

  // Unarchive a habit
  app.post("/api/habits/:id/unarchive", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const habit = await storage.unarchiveHabit(id, userId);

      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }

      res.json(habit);
    } catch (error) {
      console.error("Error unarchiving habit:", error);
      res.status(500).json({ message: "Failed to unarchive habit" });
    }
  });

  // ========== HABIT COMPLETION ROUTES ==========

  // Get completions for a habit
  app.get("/api/habits/:id/completions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

      const completions = await storage.getCompletionsByHabitId(id, userId, limit);
      res.json(completions);
    } catch (error) {
      console.error("Error fetching completions:", error);
      res.status(500).json({ message: "Failed to fetch completions" });
    }
  });

  // Get all completions for current user (with date filtering)
  app.get("/api/completions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;

      const completions = await storage.getCompletionsByUserId(userId, startDate, endDate);
      res.json(completions);
    } catch (error) {
      console.error("Error fetching completions:", error);
      res.status(500).json({ message: "Failed to fetch completions" });
    }
  });

  // Create a completion (mark habit as completed)
  app.post("/api/completions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validation = insertHabitCompletionSchema.safeParse(req.body);

      if (!validation.success) {
        const error = fromZodError(validation.error);
        return res.status(400).json({ message: error.message });
      }

      // Verify habit belongs to user
      const habit = await storage.getHabitById(validation.data.habitId, userId);
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }

      const completion = await storage.createCompletion({
        ...validation.data,
        userId,
      });

      res.status(201).json(completion);
    } catch (error: any) {
      console.error("Error creating completion:", error);
      if (error.code === "23505") {
        return res.status(400).json({ message: "Habit already completed for this date" });
      }
      res.status(500).json({ message: "Failed to create completion" });
    }
  });

  // Delete a completion
  app.delete("/api/completions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const deleted = await storage.deleteCompletion(id, userId);

      if (!deleted) {
        return res.status(404).json({ message: "Completion not found" });
      }

      res.json({ message: "Completion deleted successfully" });
    } catch (error) {
      console.error("Error deleting completion:", error);
      res.status(500).json({ message: "Failed to delete completion" });
    }
  });

  // ========== STATISTICS ROUTES ==========

  // Get user statistics
  app.get("/api/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const days = req.query.days ? parseInt(req.query.days) : 30;

      const stats = await storage.getUserStats(userId, days);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // ========== V2.0 GAMIFICATION ROUTES ==========

  // Get user profile (XP, level, streaks)
  app.get("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Update user profile
  app.put("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validation = updateUserProfileSchema.safeParse(req.body);

      if (!validation.success) {
        const error = fromZodError(validation.error);
        return res.status(400).json({ message: error.message });
      }

      const profile = await storage.updateUserProfile(userId, validation.data);
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Get all achievements
  app.get("/api/achievements", isAuthenticated, async (req: any, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Get user's unlocked achievements
  app.get("/api/achievements/mine", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  // Check and unlock achievements
  app.post("/api/achievements/check", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const newlyUnlocked = await storage.checkAchievements(userId);
      res.json({
        unlocked: newlyUnlocked,
        count: newlyUnlocked.length,
      });
    } catch (error) {
      console.error("Error checking achievements:", error);
      res.status(500).json({ message: "Failed to check achievements" });
    }
  });

  // Get all habit templates
  app.get("/api/templates", isAuthenticated, async (req: any, res) => {
    try {
      const category = req.query.category as string | undefined;
      const templates = await storage.getTemplates(category);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Get a single template
  app.get("/api/templates/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getTemplateById(id);

      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Create habit from template
  app.post("/api/habits/from-template/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const habit = await storage.createHabitFromTemplate(userId, id);

      // Check achievements after creating habit
      await storage.checkAchievements(userId);

      res.status(201).json(habit);
    } catch (error: any) {
      console.error("Error creating habit from template:", error);
      if (error.message === "Template not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create habit from template" });
    }
  });

  // Create journal entry
  app.post("/api/journal", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validation = insertHabitJournalSchema.safeParse(req.body);

      if (!validation.success) {
        const error = fromZodError(validation.error);
        return res.status(400).json({ message: error.message });
      }

      const journal = await storage.createJournalEntry({
        ...validation.data,
        userId,
      });

      res.status(201).json(journal);
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(500).json({ message: "Failed to create journal entry" });
    }
  });

  // Get user's journal entries
  app.get("/api/journal", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const journals = await storage.getJournalsByUser(userId, limit);
      res.json(journals);
    } catch (error) {
      console.error("Error fetching journals:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  // Create milestone
  app.post("/api/milestones", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validation = insertMilestoneSchema.safeParse(req.body);

      if (!validation.success) {
        const error = fromZodError(validation.error);
        return res.status(400).json({ message: error.message });
      }

      const milestone = await storage.createMilestone({
        ...validation.data,
        userId,
      });

      res.status(201).json(milestone);
    } catch (error) {
      console.error("Error creating milestone:", error);
      res.status(500).json({ message: "Failed to create milestone" });
    }
  });

  // Get user's milestones
  app.get("/api/milestones", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const milestones = await storage.getMilestonesByUser(userId);
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      res.status(500).json({ message: "Failed to fetch milestones" });
    }
  });

  // Create reminder
  app.post("/api/reminders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validation = insertHabitReminderSchema.safeParse(req.body);

      if (!validation.success) {
        const error = fromZodError(validation.error);
        return res.status(400).json({ message: error.message });
      }

      const reminder = await storage.createReminder({
        ...validation.data,
        userId,
      });

      res.status(201).json(reminder);
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(500).json({ message: "Failed to create reminder" });
    }
  });

  // Get user's reminders
  app.get("/api/reminders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const reminders = await storage.getRemindersByUser(userId);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });

  // Update reminder
  app.put("/api/reminders/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const validation = insertHabitReminderSchema.partial().safeParse(req.body);

      if (!validation.success) {
        const error = fromZodError(validation.error);
        return res.status(400).json({ message: error.message });
      }

      const reminder = await storage.updateReminder(id, userId, validation.data);

      if (!reminder) {
        return res.status(404).json({ message: "Reminder not found" });
      }

      res.json(reminder);
    } catch (error) {
      console.error("Error updating reminder:", error);
      res.status(500).json({ message: "Failed to update reminder" });
    }
  });

  // Delete reminder
  app.delete("/api/reminders/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const deleted = await storage.deleteReminder(id, userId);

      if (!deleted) {
        return res.status(404).json({ message: "Reminder not found" });
      }

      res.json({ message: "Reminder deleted successfully" });
    } catch (error) {
      console.error("Error deleting reminder:", error);
      res.status(500).json({ message: "Failed to delete reminder" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
