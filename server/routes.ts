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

  const httpServer = createServer(app);

  return httpServer;
}
