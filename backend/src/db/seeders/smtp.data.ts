import { env } from "@/config/env";
import { smtpConfigTable } from "../schema/system-config.table";

export const smtpSeederData = [
  // Auth emails (verification, password reset, etc.)
  {
    host: "smtp.gmail.com",
    port: "587" as const,
    username: "sundaram20004@gmail.com",
    password: "smpwfexskpfpwscq",
    from_email: "sundaram20004@gmail.com",
    smtp_type: "auth" as const,
    is_active: true,
  },
  // General system emails (notifications, alerts, etc.)
  {
    host: "smtp.gmail.com",
    port: "587" as const,
    username: "sundaram20004@gmail.com",
    password: "smpwfexskpfpwscq",
    from_email: "sundaram20004@gmail.com",
    smtp_type: "general" as const,
    is_active: true,
  },
  // Marketing emails (newsletters, promotions, etc.)
  {
    host: "smtp.gmail.com",
    port: "587" as const,
    username: "sundaram20004@gmail.com",
    password: "smpwfexskpfpwscq",
    from_email: "sundaram20004@gmail.com",
    smtp_type: "marketing" as const,
    is_active: true,
  },
  // Update emails (product updates, announcements, etc.)
  {
    host: "smtp.gmail.com",
    port: "587" as const,
    username: "sundaram20004@gmail.com",
    password: "smpwfexskpfpwscq",
    from_email: "sundaram20004@gmail.com",
    smtp_type: "updates" as const,
    is_active: true,
  },
];

// For development/testing with Mailtrap
export const developmentSmtpData = [
  {
    host: "smtp.gmail.com",
    port: "587" as const,
    username: "sundaram20004@gmail.com",
    password: "smpwfexskpfpwscq",
    from_email: "sundaram20004@gmail.com",
    smtp_type: "auth" as const,
    is_active: true,
  },
  {
    host: "smtp.gmail.com",
    port: "587" as const,
    username: "sundaram20004@gmail.com",
    password: "smpwfexskpfpwscq",
    from_email: "sundaram20004@gmail.com",
    smtp_type: "general" as const,
    is_active: true,
  },
];

// Helper function to seed SMTP configs
export async function seedSmtpConfig(db: any) {
  const isDevelopment = env.NODE_ENV !== "PRODUCTION";
  const dataToSeed = isDevelopment ? developmentSmtpData : smtpSeederData;

  await db.insert(smtpConfigTable).values(dataToSeed);
  console.log("✅ SMTP configs seeded successfully");
}
