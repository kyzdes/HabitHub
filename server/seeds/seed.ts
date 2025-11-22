import { db } from "../db";
import { achievements, habitTemplates } from "@shared/schema";
import { achievementsSeed } from "./achievements";
import { habitTemplatesSeed } from "./templates";

/**
 * Seed database with initial data for v2.0
 *
 * This script populates:
 * - 40+ achievements for gamification
 * - 40+ habit templates for quick creation
 */
export async function seedDatabase() {
  console.log("🌱 Starting database seed...\n");

  try {
    // Seed achievements
    console.log("📊 Seeding achievements...");
    const achievementResult = await db
      .insert(achievements)
      .values(achievementsSeed)
      .onConflictDoNothing()
      .returning();
    console.log(`✅ Inserted ${achievementResult.length} achievements\n`);

    // Seed habit templates
    console.log("📋 Seeding habit templates...");
    const templateResult = await db
      .insert(habitTemplates)
      .values(habitTemplatesSeed)
      .onConflictDoNothing()
      .returning();
    console.log(`✅ Inserted ${templateResult.length} habit templates\n`);

    console.log("🎉 Database seed completed successfully!");
    console.log("\nSummary:");
    console.log(`- Achievements: ${achievementResult.length}`);
    console.log(`- Templates: ${templateResult.length}`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("\n✨ Seed script finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Seed script failed:", error);
      process.exit(1);
    });
}
