import z, { email } from "zod";

export const RegisterSmtpSchema = z.object({
    host: z.string(),
    port: z.enum(["465", "587", "25", "2525"]),
    username: z.string(),
    password: z.string(),
    from_email: z.string(),
    is_active: z.boolean(),
    smtp_type: z.enum(["auth", "general", "marketing", "updates"]),
});

export const UpdateSmtpSchema = RegisterSmtpSchema.partial();

export const NodemailerSchema = z.object({
  host: z.string(),
  port: z.string(),
  secure: z.boolean(),
  username: z.string(),
  password: z.string(),
  from_email: z.string().trim().email().transform((val) => val.toLowerCase())    
});

export const SendEmailSchema = z.object({
  to_email: z.array(z.string().trim().email().transform((val) => val.toLowerCase())),
  subject: z.string(),
  smtp_type: z.enum(["auth", "general", "marketing", "updates"]),
  html: z.string().optional(),
  text: z.string().optional(),
});

export type RegisterSmtp = z.infer<typeof RegisterSmtpSchema>;
export type UpdateSmtp = z.infer<typeof UpdateSmtpSchema>;
export type Nodemailer = z.infer<typeof NodemailerSchema>;
export type SendEmail = z.infer<typeof SendEmailSchema>;