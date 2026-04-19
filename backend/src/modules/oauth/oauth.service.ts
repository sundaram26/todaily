import { AppError, BadRequestError } from "@/utils/app-error";
import { AuthRepository } from "../auth/auth.repository";
import { providerName, providers } from "./providers/oauth.provider";
import { generateAccessToken, generateRefreshToken, getExpiryDate, JwtToken } from "../auth/auth.util";
import { env } from "@/config/env";
import crypto from "crypto";

type OAuthLoginData = {
    ip_address: string;
    device_info?: Record<string, unknown>;
    fcm_token?: string;
}

export class OAuthService {
    constructor(private authRepo: AuthRepository) { }

    async generateUniqueUsername(email: string) {
        if (!email) {
            throw new AppError("Email not found!");
        }
        const baseUsername = email
            .split("@")[0]
            ?.toLowerCase()
            .replace(/[^a-z0-9_]/g, "")
            .slice(0, 20);

        if (!baseUsername) {
            return `user_${Date.now()}`;
        }

        const existingUser = await this.authRepo.findUserByUsername(baseUsername);

        if (!existingUser) {
            return baseUsername;
        }

        for (let i = 1; i <= 100; i++) {
            const usernameCandidate = `${baseUsername.slice(0, 17)}${i}`;
            const exists = await this.authRepo.findUserByUsername(usernameCandidate);
            if (!exists) {
                return usernameCandidate;
            }
        }

        const randomSuffix = crypto.randomBytes(3).toString("hex");
        return `${baseUsername.slice(0, 16)}${randomSuffix}`;
    }

    async login(provider_name: providerName, code: string, data: OAuthLoginData) {
        const provider = providers[provider_name];

        if (!provider) {
            throw new BadRequestError("Invalid oauth provider!");
        }

        const token = await provider.getTokens(code);

        if (!token) {
            throw new AppError("Unable to generate token!");
        }

        const userInfo = await provider.getUserInfo(token);

        const account = await this.authRepo.findAccount(
            userInfo.provider,
            userInfo.id,
        );

        if (account) {
            const existingUser = await this.authRepo.findUserById(account.user_id);

            if (!existingUser) {
                throw new AppError("Unable to find the user!");
            }

            const payload: JwtToken = {
                user_id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email,
            };

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            const userSession = await this.authRepo.createUserSession({
                user_id: existingUser.id,
                refresh_token: refreshToken,
                expires_at: getExpiryDate(env.JWT_REFRESH_SECRET),
                ip_address: data.ip_address,
                absolute_expiry: getExpiryDate(env.SESSION_EXPIRY),
                device_info: data.device_info,
            });

            if (!userSession) {
                throw new AppError("Unable to create user session!");
            }

            return {
                accessToken,
                refreshToken,
            };
        }

        const user = await this.authRepo.createGoogleAuthUserWithAccount(
            {
                email: userInfo.email,
                username: await this.generateUniqueUsername(userInfo.email),
                first_name: userInfo.firstname,
                last_name: userInfo.lastname,
                profile: userInfo.profile,
                is_verified: true,
            },
            {
                provider: "google",
                provider_account_id: userInfo.id,
            },
        );

        const payload: JwtToken = {
            user_id: user.id,
            username: user.username,
            email: user.email,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const userSession = await this.authRepo.createUserSession({
            user_id: user.id,
            refresh_token: refreshToken,
            expires_at: getExpiryDate(env.JWT_REFRESH_SECRET),
            ip_address: data.ip_address,
            absolute_expiry: getExpiryDate(env.SESSION_EXPIRY),
            device_info: data.device_info,
        });

        if (!userSession) {
            throw new AppError("Unable to create user session!");
        }

        return {
            accessToken,
            refreshToken,
        };
    }
}