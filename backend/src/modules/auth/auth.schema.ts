import z from "zod";

export const RegisterUserSchema = z.object({
    first_name: z.string().trim().min(3).optional(),
    last_name: z.string().trim().optional(),
    username: z
        .string()
        .trim()
        .min(3)
        .max(20)
        .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscore"),
    email: z
        .string()
        .trim()
        .email()
        .transform((val) => val.toLowerCase()),
    password: z
        .string()
        .min(6)
        .regex(/[A-Z]/, "Must include uppercase")
        .regex(/[0-9]/, "Must include number"),
});

export const UpdateUserSchema = RegisterUserSchema.partial().omit({
    password: true,
    email: true,
});

export const LoginUserSchema = z.object({
    email: z.string().trim().email().transform(val => val.toLowerCase()),
    password: z.string().trim().min(6),
    fcm_token: z.string().optional(),
    device_info: z.object({}).passthrough().optional(),
});

export const RefreshTokenSchema = z.object({
    refresh_token: z.string().trim()
})

export const LogoutUserSchema = z.object({
    fcm_token: z.string().optional()
})

export const OtpSchema = z.object({
    user_id: z.number(),
    otp: z.string(),
})

export const SendOtpSchema = z.object({
    email: z.string().trim().email().transform(val => val.toLowerCase()),
})

export const VerifyOtpSchema = z.object({
    otp: z.string().trim().length(6).regex(/^\d+$/),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().trim().email(),
})

export const ResetPasswordSchema = z.object({
    password: z
        .string()
        .trim()
        .min(6)
        .regex(/[A-Z]/, "Must include uppercase")
        .regex(/[0-9]/, "Must include number"),
    otp: z.string().trim().length(6).regex(/^\d+$/),
});

export const ChangePasswordSchema = z.object({
    old_password: z.string().trim().min(6),
    new_password: z.string().trim().min(6)
})


export type RegisterUser = z.infer<typeof RegisterUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>
export type LoginUser = z.infer<typeof LoginUserSchema>
export type RefreshToken = z.infer<typeof RefreshTokenSchema>
export type LogoutUser = z.infer<typeof LogoutUserSchema>
export type Otp = z.infer<typeof OtpSchema>
export type SendOtp = z.infer<typeof SendOtpSchema>
export type VerifyOtp = z.infer<typeof VerifyOtpSchema>
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>
export type ResetPassword = z.infer<typeof ResetPasswordSchema>
export type ChangePassword = z.infer<typeof ChangePasswordSchema>
