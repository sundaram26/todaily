import { db } from "@/db";
import { smtpConfigTable } from "@/db/schema";
import { RegisterSmtp, UpdateSmtp } from "./system-config.schema";
import { AppError } from "@/utils/app-error";
import { eq } from "drizzle-orm";

export type SmtpType = "auth" | "general" | "marketing" | "updates";

type CreateSmtpInput = RegisterSmtp;

export class SystemConfigRepository {

    async findSmtpByType(smtpType: SmtpType) {
        return db.query.smtpConfigTable.findFirst({
            where: eq(smtpConfigTable.smtp_type, smtpType)
        })
    }

    async addSmtp(data: CreateSmtpInput) {
        const [smtp] = await db.insert(smtpConfigTable).values(data).returning();

        if (!smtp) {
            throw new AppError("Failed to add smtp!")
        }

        return smtp;
    }

    async updateSmtp(id: number, data: UpdateSmtp) {
        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined)
        )
        const [updatedSmtp] = await db.update(smtpConfigTable).set(cleanedData).where(eq(smtpConfigTable.id, id)).returning();

        if (!updatedSmtp) {
            throw new AppError("Failed to update smtp!");
        }

        return updatedSmtp;
    }

    async deleteSmtp(smtp_id: number) {
        const [deleted] = await db.delete(smtpConfigTable).where(eq(smtpConfigTable.id, smtp_id)).returning();

        if (!deleted) {
            throw new AppError("Failed to delete smtp");
        }

        return deleted;
    }

    async findActiveSmtp() {
        return db.query.smtpConfigTable.findMany({
            where: (eq(smtpConfigTable.is_active, true))
        })
    }

    async deactivateSmtpByType(smtpType: SmtpType) {
        await db.update(smtpConfigTable).set({is_active: false}).where(eq(smtpConfigTable.smtp_type, smtpType))
    }

    async findSmtpById(smtp_id: number) {
        return await db.query.smtpConfigTable.findFirst({
            where: eq(smtpConfigTable.id, smtp_id)
        })
    }

    async findAllSmtp() {
        return await db.query.smtpConfigTable.findFirst();
    }
}