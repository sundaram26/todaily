import { LoginUser, RegisterUser, SendOtp, SendVerifyLink, VerifyOtp, VerifyToken } from "./auth.schema";
import { AppError, BadRequestError, NotFoundError, UnauthorizedError } from "@/utils/app-error";
import { AuthRepository, CreateUserInput } from "./auth.repository";
import { comparePassword, hashPassword } from "@/services/hash-password.service";
import { generateOtp } from "@/services/otp.service";
import { sendEmailVerificationEmail, sendOtpEmail } from "@/utils/emails";
import { SmtpType } from "../system-config/system-config.repository";
import { generateAccessToken, generateRefreshToken, getExpiryDate, getVerificationToken, JwtToken, verifyJwtRefreshToken } from "./auth.util";
import { env } from "@/config/env";
import crypto from "crypto"

export class AuthService {
    constructor(private repo: AuthRepository) { }

    async register(data: RegisterUser) {
        const existingUser = await this.repo.findByEmailOrUsername(data.email, data.username);

        if (existingUser?.email === data.email || existingUser?.username === data.username) {
            throw new BadRequestError("Username or email already in use");
        }

        const hashedPassword = await hashPassword(data.password);
        const newData: CreateUserInput = {
            ...data,
            password: hashedPassword,
            is_verified: false,
        }

        const user = await this.repo.createUser(newData);

        const newToken = getVerificationToken();
        const tokenData = {
            user_id: user.id,
            verification_token: newToken.token,
            token_expiry: newToken.token_expiry,
        };

        const token = await this.repo.addToken(tokenData);

        // const verifyUrl = `${env.FRONTEND_URL}/auth/verify?token=${token}`

        const result = await sendEmailVerificationEmail({
            toEmail: user.email,
            smtpType: "auth",
            verificationToken: token.verification_token,
            expiryMinutes: 5,
            userName: user.username,
        });

        if (!result) {
            throw new AppError("Unable to send the verification email!");
        }

        return {
            id: user.id,
            email: user.email,
            username: user.username
        };
    }

    async sendVerifyLink(data: SendVerifyLink) {
        const user = await this.repo.findUserByEmail(data.email);
        if (!user) {
            throw new NotFoundError("user not found!");
        }

        if (user.is_verified) {
            throw new BadRequestError("User already verified!");
        }

        const newToken = getVerificationToken();
        const tokenData = {
            user_id: user.id,
            verification_token: newToken.token,
            token_expiry: newToken.token_expiry,
        };

        const token = await this.repo.addToken(tokenData);

        // const verifyUrl = `${env.FRONTEND_URL}/auth/verify?token=${token}`

        const result = await sendEmailVerificationEmail({
            toEmail: user.email,
            smtpType: "auth",
            verificationToken: token.verification_token,
            expiryMinutes: 5,
            userName: user.username,
        });

        if (!result) {
            throw new AppError("Unable to send the verification email!");
        }

        return result;
    }

    async verifyToken(token: string) {
        if (!token) {
            throw new BadRequestError("Unable to identify url!");
        }

        const existingToken = await this.repo.findToken(token);
        if (!existingToken || existingToken.token_expiry < new Date()) {
            throw new BadRequestError("Invalid or expired url!");
        }

        const is_verified = true;
        const updateUser = await this.repo.updateUser(existingToken.user_id, { is_verified })

        return updateUser ? is_verified : false;
    }

    async sendOtp(data: SendOtp) {
        const RATE_LIMIT_MS = 60 * 1000;

        const existingOtp = await this.repo.findOtpByUserIdAndType(data.user_id, data.otp_type);

        if (existingOtp) {
            const now = new Date();
            const timeSinceLastOtp = existingOtp.updated_at
                ? now.getTime() - existingOtp.updated_at.getTime()
                : Infinity;

            if (timeSinceLastOtp < RATE_LIMIT_MS) {
                throw new BadRequestError("Please wait before requesting another otp!");
            }
        }

        const otpCode = generateOtp();

        const newOtp = await this.repo.addOtp({
            user_id: data.user_id,
            otp: otpCode.otp,
            otp_expiry: otpCode.otp_expiry,
            type: data.otp_type
        })

        const user = await this.repo.findUserById(data.user_id);

        if (!user) {
            throw new NotFoundError("User not found!");
        }

        const sendOtpParam = {
            toEmail: user.email,
            otp: newOtp.otp,
            expiryMinutes: 5,
            userName: user.username,
            smtpType: "auth" as SmtpType
        }

        const result = await sendOtpEmail(sendOtpParam);

        if (!result) {
            throw new AppError("Email not sent!")
        }

        return result;
    }

    // async verifyOtp(data: VerifyOtp) {
    //     const userOtp = await this.repo.findOtpByUserIdAndType(data.user_id, data.type);

    //     if (!userOtp) {
    //       throw new AppError("User otp not found!");
    //     }

    //     const now = new Date();
    //     if (userOtp.otp_expiry < now) {
    //         await this.repo.deleteOtpById(userOtp.id);
    //         throw new AppError("OTP expired!");
    //     }

    //     if (crypto.timingSafeEqual(Buffer.from(userOtp.otp), Buffer.from(data.otp))) {
    //         await this.repo.deleteOtpById(userOtp.id);

    //         if (data.type === "email_verification") {
    //             await this.repo.updateUser(data.user_id, { is_verified: true });
    //         }

    //         return true;
    //     }

    //     return false;
    // }

    async resendOtp(data: SendOtp) {
        return await this.sendOtp(data);
    }

    async login(data: LoginUser) {
        const existingUser = await this.repo.findUserByEmail(data.email);

        if (!existingUser || !existingUser.password) {
            throw new NotFoundError("User not found!");
        }

        if (!data.password) {
            throw new UnauthorizedError("Password required!")
        }

        const matchPassword = await comparePassword(data.password, existingUser.password);

        if (!matchPassword) {
            throw new UnauthorizedError("Invalid credentials!");
        }

        if (!existingUser.is_verified) {
            const newToken = getVerificationToken();
            const tokenData = {
                user_id: existingUser.id,
                verification_token: newToken.token,
                token_expiry: newToken.token_expiry,
            };

            await this.repo.addToken(tokenData);

            await sendEmailVerificationEmail({
                toEmail: existingUser.email,
                smtpType: "auth",
                verificationToken: tokenData.verification_token,
                expiryMinutes: 5,
                userName: existingUser.username,
            });

            throw new UnauthorizedError(
                "Please verify your email. Verification link sent!",
            );
        }

        const payload: JwtToken = {
            user_id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email
        }

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const userSession = await this.repo.createUserSession({
            user_id: existingUser.id,
            refresh_token: refreshToken,
            expires_at: getExpiryDate(env.JWT_REFRESH_EXPIRY),
            ip_address: data.ip_address || "",
            absolute_expiry: getExpiryDate(env.SESSION_EXPIRY),
            device_info: data.device_info
        })

        if (!userSession) {
            throw new AppError("Unable to create user session!")
        }

        return {
            accessToken,
            refreshToken
        }
    }

    async findUser(user_id: string) {
        if (!user_id) {
            throw new UnauthorizedError("Unauthorized user!");
        }

        const user = await this.repo.findUserById(user_id);

        return user;
    }

    async refreshToken(token: string) {
        const decode = verifyJwtRefreshToken(token);

        const storedToken = await this.repo.findSessionByRefreshToken(token);

        if (!storedToken) {
            throw new NotFoundError("Session not found!");
        }

        const now = new Date();

        if (storedToken.expires_at < now || storedToken.absolute_expiry < now) {
            throw new UnauthorizedError("Invalid or expired session!");
        }

        const payload = {
            user_id: decode.user_id,
            username: decode.username,
            email: decode.email
        }

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const userSession = await this.repo.updateUserSession(token, {
            refresh_token: refreshToken,
            expires_at: getExpiryDate(env.JWT_REFRESH_SECRET),
            absolute_expiry: storedToken.absolute_expiry
        });

        if (!userSession) {
            throw new AppError("Unable to create user session!");
        }

        return {
            accessToken,
            refreshToken
        }
    }

    async logout(token: string) {
        const loggedOut = await this.repo.deleteSessionByRefreshToken(token);

        if (!loggedOut) {
            throw new AppError("Unable to log out!");
        }

        return loggedOut;
    }

    // TODO: Complete these after oAuth 2.0 and openId Connect    
    // async forgotPassword(email: string) { 
    //     const user = await this.repo.findUserByEmail(email);

    //     if (!user) {
    //         throw new NotFoundError("User not found!");
    //     }      
    // }

    // async resetPassword() { }

    // async changePassword() { }
}
