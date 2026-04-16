import z from "zod";

export const RegisterUserSchema = z.object({
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

export const UpdateUserSchema = RegisterUserSchema
    .partial()
    .omit({
        password: true,
        email: true,
    })
    .extend({
        is_verified: z.boolean().optional(),
    });

export const LoginUserSchema = z.object({
    email: z.string().trim().email().transform(val => val.toLowerCase()),
    password: z.string().trim()
        .min(6)
        .regex(/[A-Z]/, "Must include uppercase")
        .regex(/[0-9]/, "Must include number"),
    ip_address: z.string(),
    fcm_token: z.string().optional(),
    device_info: z.object({}).passthrough().optional(),
    provider: z.enum(["local"])
});

export const UserSessionSchema = z.object({
    user_id: z.string().uuid(),
    refresh_token: z.string().min(1),
    expires_at: z.date(),
    device_info: z.object({}).passthrough().optional(),
    ip_address: z.string(),
    absolute_expiry: z.date()
})

export const UpdateUserSessionSchema = UserSessionSchema.partial();

export const LogoutUserSchema = z.object({
    fcm_token: z.string().optional()
})

export const OtpTypeEnum = z.enum(["email_verification", "password_reset"])

export const OtpSchema = z.object({
    user_id: z.string().uuid(),
    otp: z.string().min(6).max(6),
    type: OtpTypeEnum,
    otp_expiry: z.date()
})

export const SendOtpSchema = z.object({
    user_id: z.string().uuid(),
    otp_type: OtpTypeEnum
})

export const VerifyOtpSchema = z.object({
    user_id: z.string().uuid(),
    otp: z.string().trim().length(6).regex(/^\d+$/),
    type: OtpTypeEnum
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
  new_password: z
    .string()
    .trim()
    .min(6)
    .regex(/[A-Z]/, "Must include uppercase")
    .regex(/[0-9]/, "Must include number"),
});


export type RegisterUser = z.infer<typeof RegisterUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>
export type LoginUser = z.infer<typeof LoginUserSchema>
export type UserSession = z.infer<typeof UserSessionSchema>
export type UpdateUserSession = z.infer<typeof UpdateUserSessionSchema>
export type LogoutUser = z.infer<typeof LogoutUserSchema>
export type Otp = z.infer<typeof OtpSchema>
export type OtpType = z.infer<typeof OtpTypeEnum>
export type SendOtp = z.infer<typeof SendOtpSchema>
export type VerifyOtp = z.infer<typeof VerifyOtpSchema>
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>
export type ResetPassword = z.infer<typeof ResetPasswordSchema>
export type ChangePassword = z.infer<typeof ChangePasswordSchema>
