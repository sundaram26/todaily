import { z } from "zod";

export const RegisterForm = z.object({
  username: z.string().trim().min(3, "username should consist 3 or more characters").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscore"),
  email: z.string().trim().email(),
  password: z.string().min(8, "Password should contain 8 or more characters")
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

const LoginFrom = z.object({
  email: z.string().email(),
  password: z.string().min(8, "password should contain atleast 8 characters!"),
  ip_address: z.string().optional(),
  provider: providerTypes.optional(),
  fcm_tokens: z.string().optional(),
  device_info: z.string().optional()
});


export type RegisterType = z.infer<typeof RegisterForm>;
export type SendOtpType = z.infer<typeof SendOtp>;
export type VerifyOtpType = z.infer<typeof VerifyOtp>;
export type LoginType = z.infer<typeof LoginFrom>;