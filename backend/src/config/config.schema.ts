import z from "zod";

export const EnvSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_ACCESS_SECRET: z.string().min(1),
    JWT_ACCESS_EXPIRY: z.string(),
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_REFRESH_EXPIRY: z.string(),
    SESSION_EXPIRY: z.string(),
})

export type EnvType = z.infer<typeof EnvSchema>;