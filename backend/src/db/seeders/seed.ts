import { db } from "../index";
import { seedSmtpConfig } from "./smtp.data";

async function runSeeders() {
  try {
    console.log("🌱 Starting database seeding...");

    await seedSmtpConfig(db);

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

runSeeders();
