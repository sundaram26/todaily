import { generateEmailTemplate, generateOtpCard, generateInfoList, generateWarningAlert, generateSuccessAlert } from "./email-template";
import { sendEmail } from "@/services/send-email.service";
import type { SendEmail } from "@/modules/system-config/system-config.schema";

const BASE_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const DEFAULT_BRAND_NAME = "Todaily";
const DEFAULT_BRAND_COLOR = "#2563eb";

type EmailParams = {
  toEmail: string;
  smtpType?: SendEmail["smtp_type"];
};

export interface SendOtpParams extends EmailParams {
  otp: string;
  expiryMinutes: number;
  userName?: string;
}

export const sendOtpEmail = async (params: SendOtpParams) => {
  const { toEmail, otp, expiryMinutes, userName, smtpType = "auth" } = params;

  const greeting = userName ? `Hi ${userName},` : "Hello,";
  const expiryTime = expiryMinutes === 1 ? "1 minute" : `${expiryMinutes} minutes`;

  const content = `
    <p style="margin: 0 0 16px 0;">${greeting} We received a request to verify your email address. Use the verification code below to complete the process:</p>
    ${generateOtpCard({ otp, expiryTime })}
    <p style="margin: 16px 0 0 0;">For your security, this code will expire in <strong>${expiryTime}</strong>. If you didn't request this verification, please ignore this email.</p>
  `;

  const html = generateEmailTemplate({
    subject: "Verify Your Email Address",
    heading: "Verify Your Email",
    previewText: `Your verification code is ${otp}`,
    content,
    brandName: DEFAULT_BRAND_NAME,
    brandColor: DEFAULT_BRAND_COLOR,
  });

  return sendEmail({
    to_email: [toEmail],
    subject: "Verify Your Email Address",
    smtp_type: smtpType,
    html,
    text: `${greeting}\n\nYour verification code is: ${otp}\n\nThis code will expire in ${expiryTime}.\n\nIf you didn't request this, please ignore this email.`,
  });
};

export const resendOtpEmail = async (params: SendOtpParams) => {
  const { toEmail, otp, expiryMinutes, userName, smtpType = "auth" } = params;

  const greeting = userName ? `Hi ${userName},` : "Hello,";
  const expiryTime = expiryMinutes === 1 ? "1 minute" : `${expiryMinutes} minutes`;

  const content = `
    <p style="margin: 0 0 16px 0;">${greeting} Here is a new verification code for you. Your previous code has been invalidated.</p>
    ${generateOtpCard({ otp, expiryTime })}
    ${generateWarningAlert("Each verification code can only be used once. Please use this new code to complete your verification.")}
  `;

  const html = generateEmailTemplate({
    subject: "New Verification Code",
    heading: "Your New Verification Code",
    previewText: `Your new verification code is ${otp}`,
    content,
    brandName: DEFAULT_BRAND_NAME,
    brandColor: DEFAULT_BRAND_COLOR,
  });

  return sendEmail({
    to_email: [toEmail],
    subject: "New Verification Code",
    smtp_type: smtpType,
    html,
    text: `${greeting}\n\nYour new verification code is: ${otp}\n\nThis code will expire in ${expiryTime}.\n\nYour previous code is no longer valid.`,
  });
};

export interface WelcomeOnboardingParams extends EmailParams {
  userName?: string;
  email: string;
  actionUrl?: string;
}

export const sendWelcomeEmail = async (params: WelcomeOnboardingParams) => {
  const { toEmail, userName, email, actionUrl = `${BASE_URL}/dashboard`, smtpType = "general" } = params;

  const greeting = userName ? `Hi ${userName},` : "Hello,";

  const content = `
    <p style="margin: 0 0 16px 0;">${greeting} Welcome to ${DEFAULT_BRAND_NAME}! We're thrilled to have you on board.</p>
    <p style="margin: 0 0 16px 0;">Your account has been successfully created. You can now start exploring all the features we have to offer.</p>
    ${generateInfoList({
      items: [
        { label: "Email", value: email },
        { label: "Account Status", value: "Active" },
      ],
    })}
    <p style="margin: 16px 0 0 0;">If you have any questions, feel free to reach out to our support team. We're here to help!</p>
  `;

  const html = generateEmailTemplate({
    subject: `Welcome to ${DEFAULT_BRAND_NAME}!`,
    heading: "Welcome Aboard! 🎉",
    previewText: `Get started with ${DEFAULT_BRAND_NAME}`,
    content,
    buttonLabel: "Get Started",
    buttonUrl: actionUrl,
    brandName: DEFAULT_BRAND_NAME,
    brandColor: DEFAULT_BRAND_COLOR,
  });

  return sendEmail({
    to_email: [toEmail],
    subject: `Welcome to ${DEFAULT_BRAND_NAME}!`,
    smtp_type: smtpType,
    html,
    text: `${greeting}\n\nWelcome to ${DEFAULT_BRAND_NAME}! Your account has been successfully created.\n\nEmail: ${email}\n\nGet started: ${actionUrl}`,
  });
};

export interface ForgotPasswordParams extends EmailParams {
  resetToken: string;
  expiryMinutes: number;
  userName?: string;
}

export const sendForgotPasswordEmail = async (params: ForgotPasswordParams) => {
  const { toEmail, resetToken, expiryMinutes, userName, smtpType = "auth" } = params;

  const greeting = userName ? `Hi ${userName},` : "Hello,";
  const resetUrl = `${BASE_URL}/auth/reset-password?token=${resetToken}`;
  const expiryTime = expiryMinutes === 1 ? "1 minute" : `${expiryMinutes} minutes`;

  const content = `
    <p style="margin: 0 0 16px 0;">${greeting} We received a request to reset the password for your account. Click the button below to create a new password:</p>
    ${generateWarningAlert(`This password reset link will expire in ${expiryTime}. For security reasons, you should request a new link if it expires.`)}
    <p style="margin: 16px 0 0 0;">If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
  `;

  const html = generateEmailTemplate({
    subject: "Reset Your Password",
    heading: "Password Reset Request",
    previewText: "Reset your password securely",
    content,
    buttonLabel: "Reset Password",
    buttonUrl: resetUrl,
    brandName: DEFAULT_BRAND_NAME,
    brandColor: DEFAULT_BRAND_COLOR,
  });

  return sendEmail({
    to_email: [toEmail],
    subject: "Reset Your Password",
    smtp_type: smtpType,
    html,
    text: `${greeting}\n\nClick the link below to reset your password:\n${resetUrl}\n\nThis link will expire in ${expiryTime}.\n\nIf you didn't request this, please ignore this email.`,
  });
};

export interface PasswordResetSuccessParams extends EmailParams {
  userName?: string;
  resetTime?: Date;
}

export const sendPasswordResetSuccessEmail = async (params: PasswordResetSuccessParams) => {
  const { toEmail, userName, resetTime, smtpType = "auth" } = params;

  const greeting = userName ? `Hi ${userName},` : "Hello,";
  const timeStr = resetTime ? resetTime.toLocaleString() : new Date().toLocaleString();

  const content = `
    ${generateSuccessAlert("Your password has been successfully reset.")}
    <p style="margin: 0 0 16px 0;">${greeting} Your password was reset on <strong>${timeStr}</strong>. If you didn't make this change, please contact our support team immediately.</p>
    <p style="margin: 0;">For your security, we recommend:</p>
    <ul style="margin: 8px 0; padding-left: 20px;">
      <li style="margin: 4px 0;">Using a strong, unique password</li>
      <li style="margin: 4px 0;">Not sharing your password with anyone</li>
      <li style="margin: 4px 0;">Enabling two-factor authentication if available</li>
    </ul>
  `;

  const html = generateEmailTemplate({
    subject: "Password Successfully Reset",
    heading: "Password Reset Complete",
    previewText: "Your password has been changed",
    content,
    buttonLabel: "Sign In",
    buttonUrl: `${BASE_URL}/auth/signin`,
    brandName: DEFAULT_BRAND_NAME,
    brandColor: DEFAULT_BRAND_COLOR,
  });

  return sendEmail({
    to_email: [toEmail],
    subject: "Password Successfully Reset",
    smtp_type: smtpType,
    html,
    text: `${greeting}\n\nYour password was successfully reset on ${timeStr}.\n\nIf you didn't make this change, please contact support immediately.\n\nSign in: ${BASE_URL}/auth/signin`,
  });
};

export interface EmailVerificationParams extends EmailParams {
  verificationToken: string;
  expiryMinutes: number;
  userName?: string;
}

export const sendEmailVerificationEmail = async (params: EmailVerificationParams) => {
  const { toEmail, verificationToken, expiryMinutes, userName, smtpType = "auth" } = params;

  const greeting = userName ? `Hi ${userName},` : "Hello,";
  const verifyUrl = `${BASE_URL}/auth/verify-email?token=${verificationToken}`;
  const expiryTime = expiryMinutes === 1 ? "1 minute" : `${expiryMinutes} minutes`;

  const content = `
    <p style="margin: 0 0 16px 0;">${greeting} Please verify your email address to activate your account. This helps us ensure the security of your account and prevent unauthorized access.</p>
    ${generateWarningAlert(`The verification link will expire in ${expiryTime}. Please verify your email soon.`)}
    <p style="margin: 16px 0 0 0;">If the button below doesn't work, you can copy and paste this link into your browser:</p>
    <p style="margin: 8px 0; word-break: break-all; color: #2563eb;">${verifyUrl}</p>
  `;

  const html = generateEmailTemplate({
    subject: "Verify Your Email Address",
    heading: "Please Verify Your Email",
    previewText: "Activate your account by verifying your email",
    content,
    buttonLabel: "Verify Email",
    buttonUrl: verifyUrl,
    brandName: DEFAULT_BRAND_NAME,
    brandColor: DEFAULT_BRAND_COLOR,
  });

  return sendEmail({
    to_email: [toEmail],
    subject: "Verify Your Email Address",
    smtp_type: smtpType,
    html,
    text: `${greeting}\n\nPlease verify your email: ${verifyUrl}\n\nThis link expires in ${expiryTime}.`,
  });
};

export interface AccountLockedParams extends EmailParams {
  lockReason?: string;
  supportEmail?: string;
  userName?: string;
}

export const sendAccountLockedEmail = async (params: AccountLockedParams) => {
  const { toEmail, lockReason, supportEmail = "support@example.com", userName, smtpType = "auth" } = params;

  const greeting = userName ? `Hi ${userName},` : "Hello,";

  const content = `
    ${generateWarningAlert("Your account has been temporarily locked for security reasons.")}
    <p style="margin: 0 0 16px 0;">${greeting} We detected suspicious activity on your account and have temporarily locked it as a security measure.</p>
    ${lockReason ? `<p style="margin: 0 0 16px 0;"><strong>Reason:</strong> ${lockReason}</p>` : ""}
    <p style="margin: 0 0 16px 0;">To regain access to your account, please contact our support team.</p>
    ${generateInfoList({
      items: [
        { label: "Support Email", value: supportEmail },
        { label: "Account Status", value: "Locked" },
      ],
    })}
  `;

  const html = generateEmailTemplate({
    subject: "Account Temporarily Locked",
    heading: "Account Security Alert",
    previewText: "Your account has been locked for security",
    content,
    buttonLabel: "Contact Support",
    buttonUrl: `mailto:${supportEmail}`,
    brandName: DEFAULT_BRAND_NAME,
    brandColor: DEFAULT_BRAND_COLOR,
  });

  return sendEmail({
    to_email: [toEmail],
    subject: "Account Temporarily Locked",
    smtp_type: smtpType,
    html,
    text: `${greeting}\n\nYour account has been locked for security.\n${lockReason ? `Reason: ${lockReason}\n` : ""}Contact: ${supportEmail}`,
  });
};

export interface LoginAlertParams extends EmailParams {
  loginTime?: Date;
  deviceInfo?: string;
  location?: string;
  userName?: string;
}

export const sendLoginAlertEmail = async (params: LoginAlertParams) => {
  const { toEmail, loginTime, deviceInfo, location, userName, smtpType = "auth" } = params;

  const greeting = userName ? `Hi ${userName},` : "Hello,";
  const timeStr = loginTime ? loginTime.toLocaleString() : new Date().toLocaleString();

  const content = `
    <p style="margin: 0 0 16px 0;">${greeting} We detected a new sign-in to your account. If this was you, you can safely ignore this email.</p>
    ${generateInfoList({
      items: [
        { label: "Time", value: timeStr },
        ...(deviceInfo ? [{ label: "Device", value: deviceInfo }] : []),
        ...(location ? [{ label: "Location", value: location }] : []),
      ],
    })}
    ${generateWarningAlert("If you don't recognize this sign-in, please secure your account immediately by changing your password.")}
  `;

  const html = generateEmailTemplate({
    subject: "New Sign-In Detected",
    heading: "Security Alert: New Sign-In",
    previewText: "A new sign-in was detected on your account",
    content,
    buttonLabel: "Review Account Activity",
    buttonUrl: `${BASE_URL}/settings/security`,
    brandName: DEFAULT_BRAND_NAME,
    brandColor: DEFAULT_BRAND_COLOR,
  });

  return sendEmail({
    to_email: [toEmail],
    subject: "New Sign-In Detected",
    smtp_type: smtpType,
    html,
    text: `${greeting}\n\nNew sign-in detected:\nTime: ${timeStr}\n${deviceInfo ? `Device: ${deviceInfo}\n` : ""}${location ? `Location: ${location}\n` : ""}\n\nIf this wasn't you, change your password immediately.`,
  });
};

export interface TwoFactorEnabledParams extends EmailParams {
  userName?: string;
  method?: "email" | "authenticator" | "sms";
}

export const sendTwoFactorEnabledEmail = async (params: TwoFactorEnabledParams) => {
  const { toEmail, userName, method = "email", smtpType = "auth" } = params;

  const greeting = userName ? `Hi ${userName},` : "Hello,";
  const methodText = method === "email" ? "email codes" : method === "sms" ? "SMS codes" : "an authenticator app";

  const content = `
    ${generateSuccessAlert("Two-factor authentication has been enabled on your account.")}
    <p style="margin: 0 0 16px 0;">${greeting} Your account security has been enhanced. You will now be required to enter a verification code from ${methodText} when signing in.</p>
    <p style="margin: 0 0 16px 0;">This additional layer of security helps protect your account from unauthorized access, even if someone knows your password.</p>
  `;

  const html = generateEmailTemplate({
    subject: "Two-Factor Authentication Enabled",
    heading: "Account Security Enhanced",
    previewText: "2FA has been enabled on your account",
    content,
    brandName: DEFAULT_BRAND_NAME,
    brandColor: DEFAULT_BRAND_COLOR,
  });

  return sendEmail({
    to_email: [toEmail],
    subject: "Two-Factor Authentication Enabled",
    smtp_type: smtpType,
    html,
    text: `${greeting}\n\nTwo-factor authentication has been enabled on your account using ${methodText}.\n\nYour account is now more secure.`,
  });
};

export interface EmailChangedParams extends EmailParams {
  newEmail: string;
  oldEmail: string;
  userName?: string;
  changedAt?: Date;
}

export const sendEmailChangedEmail = async (params: EmailChangedParams) => {
  const { toEmail, newEmail, oldEmail, userName, changedAt, smtpType = "auth" } = params;

  const greeting = userName ? `Hi ${userName},` : "Hello,";
  const timeStr = changedAt ? changedAt.toLocaleString() : new Date().toLocaleString();

  const content = `
    ${generateWarningAlert("Your account email address has been changed.")}
    <p style="margin: 0 0 16px 0;">${greeting} This email is to confirm that your account email address was changed on <strong>${timeStr}</strong>.</p>
    ${generateInfoList({
      items: [
        { label: "Previous Email", value: oldEmail },
        { label: "New Email", value: newEmail },
        { label: "Changed At", value: timeStr },
      ],
    })}
    <p style="margin: 16px 0 0 0;">If you didn't make this change, please contact our support team immediately.</p>
  `;

  const html = generateEmailTemplate({
    subject: "Email Address Changed",
    heading: "Email Change Confirmation",
    previewText: "Your email address has been updated",
    content,
    brandName: DEFAULT_BRAND_NAME,
    brandColor: DEFAULT_BRAND_COLOR,
  });

  return sendEmail({
    to_email: [toEmail],
    subject: "Email Address Changed",
    smtp_type: smtpType,
    html,
    text: `${greeting}\n\nYour email was changed on ${timeStr}.\n\nFrom: ${oldEmail}\nTo: ${newEmail}\n\nIf you didn't make this change, contact support immediately.`,
  });
};

export interface AccountDeletedParams extends EmailParams {
  deletionDate?: Date;
  recoveryPeriod?: number;
  userName?: string;
}

export const sendAccountDeletedEmail = async (params: AccountDeletedParams) => {
  const { toEmail, deletionDate, recoveryPeriod = 30, userName, smtpType = "general" } = params;

  const greeting = userName ? `Hi ${userName},` : "Hello,";
  const dateStr = deletionDate ? deletionDate.toLocaleString() : new Date().toLocaleString();

  const content = `
    <p style="margin: 0 0 16px 0;">${greeting} Your account has been successfully deleted as of <strong>${dateStr}</strong>.</p>
    <p style="margin: 0 0 16px 0;">All your personal data has been permanently removed from our systems in accordance with our privacy policy.</p>
    ${generateInfoList({
      items: [
        { label: "Deletion Date", value: dateStr },
        { label: "Data Retention", value: "Immediately deleted" },
      ],
    })}
    <p style="margin: 16px 0 0 0;">If you change your mind, you may be able to recover your account within ${recoveryPeriod} days by contacting support. After this period, recovery will not be possible.</p>
  `;

  const html = generateEmailTemplate({
    subject: "Account Successfully Deleted",
    heading: "Account Deletion Confirmed",
    previewText: "Your account has been deleted",
    content,
    brandName: DEFAULT_BRAND_NAME,
    brandColor: DEFAULT_BRAND_COLOR,
  });

  return sendEmail({
    to_email: [toEmail],
    subject: "Account Successfully Deleted",
    smtp_type: smtpType,
    html,
    text: `${greeting}\n\nYour account was deleted on ${dateStr}.\n\nAll data has been removed. Contact support within ${recoveryPeriod} days for recovery.`,
  });
};

export type { EmailParams, SendEmail };
