import crypto from "crypto";

export const otpGenerator = () => {
    try {
        const otp = crypto.randomInt(1000000, 9999999);
        const now = new Date();
        const otp_expiry = new Date(now.getTime() + 5 * 60 * 60);
        return {
            otp,
            otp_expiry
        };
    } catch (err: unknown) {
        console.error("Error while generating otp: ", err);
    }
}