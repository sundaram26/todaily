import z from "zod";

export const EnvSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_ACCESS_SECRET: z.string().min(1),
    JWT_ACCESS_EXPIRY: z.string(),
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_REFRESH_EXPIRY: z.string(),
    SESSION_EXPIRY: z.string(),
    FRONTEND_URL: z.string(),
    BACKEND_URL: z.string(),
    GOOGLE_REDIRECT_URL: z.string(),
    GOOGLE_ID: z.string(),
    GOOGLE_SECRET: z.string(),
    GOOGLE_STATE_SECRET: z.string()
})

export type EnvType = z.infer<typeof EnvSchema>;