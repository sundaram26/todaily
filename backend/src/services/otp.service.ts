import crypto from "crypto";

export const generateOtp = () => {
    try {
        const otp = crypto.randomInt(100000, 999999);
        const now = new Date();
        const otp_expiry = new Date(now.getTime() + 5 * 60 * 1000);
        
        return {
            otp: String(otp),
            otp_expiry
        };
    } catch (err: unknown) {
        console.error("Error while generating otp: ", err);
    }
}