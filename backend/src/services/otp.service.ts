import crypto from "crypto";

export type OtpResult = {
    otp: string;
    otp_expiry: Date;
}

export const generateOtp = (): OtpResult => {
    const otp = crypto.randomInt(100000, 999999);
    const now = new Date();
    const otp_expiry = new Date(now.getTime() + 5 * 60 * 1000);

    return {
        otp: String(otp),
        otp_expiry
    };
}