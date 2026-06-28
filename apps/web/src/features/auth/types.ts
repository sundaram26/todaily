import { z } from "zod";

export const RegisterForm = z.object({
  username: z.string().trim().min(3, "username should consist 3 or more characters").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscore"),
  email: z.string().trim().email(),
  password: z.string().min(8, "Password should contain 8 or more characters")
})

export const SendVerifyLinkForm = z.object({
  email: z.string().trim().email()
})

export const OtpTypeEnum = z.enum(["email_verification", "password_reset"]);

const SendOtp = z.object({
  user_id: z.string().uuid(),
  type: OtpTypeEnum
})

const VerifyOtp = z.object({
  user_id: z.string().uuid(),
  otp: z.string().min(1).max(6),
  type: OtpTypeEnum
})

export const providerTypes = z.enum(["google", "local"]);

export const LoginForm = z.object({
  email: z.string().email(),
  password: z.string().min(8, "password should contain atleast 8 characters!"),
  provider: providerTypes.optional(),
});


export type RegisterType = z.infer<typeof RegisterForm>;
export type SendVerifyLinkType = z.infer<typeof SendVerifyLinkForm>;
export type SendOtpType = z.infer<typeof SendOtp>;
export type VerifyOtpType = z.infer<typeof VerifyOtp>;
export type LoginType = z.infer<typeof LoginForm>;
export type VerifyStatus = "loading" | "success" | "error";
