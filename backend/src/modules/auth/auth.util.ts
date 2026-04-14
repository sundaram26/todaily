import { env } from "@/config/env";
import { AppError } from "@/utils/app-error";
import * as jwt from "jsonwebtoken";

export type JwtToken = {
    user_id: string,
    username: string,
    email: string
}

export const generateAccessToken = (payload: JwtToken) => {
    return jwt.sign(
        payload,
        env.JWT_ACCESS_SECRET,
        {
            expiresIn: env.JWT_ACCESS_EXPIRY
        } as jwt.SignOptions
    )
}

export const generateRefreshToken = (payload: JwtToken) => {
    return jwt.sign(
        payload,
        env.JWT_REFRESH_SECRET,
        {
            expiresIn: env.JWT_REFRESH_EXPIRY as string
        } as jwt.SignOptions
    );
}

export const verifyJwtToken = (token: string) => {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    
    if (typeof decoded === "string") {
        throw new AppError("Invalid token payload!")
    }

    return decoded as JwtToken;
}

export const verifyJwtRefreshToken = (token: string) => {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    
    if (typeof decoded === "string") {
        throw new AppError("Invalid token payload!")
    }

    return decoded as JwtToken;
}

export const getExpiryDate = (timestring: string): Date => {
    const now = Date.now();
    const match = timestring.match(/^(\d+)([smhd])$/);
    if (!match) throw new AppError("Invalid time format");

    const [, amount, unit] = match;
    if (!amount) {
        throw new AppError("Invalid amount!")
    }
    const value = parseInt(amount);
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };

    return new Date(now + value * multipliers[unit as keyof typeof multipliers])
}

export const getCookieMaxAge = (timestring: string): number => {
    const match = timestring.match(/^(\d+)([smhd])$/);
    if (!match) throw new AppError("Invalid time format");

    const [, amount, unit] = match;
    if (!amount) {
      throw new AppError("Invalid amount!");
    }

    const value = parseInt(amount);
    const multiplier = { s: 1000, m: 60000, h: 3600000, d: 86400000 };

    return value * multiplier[unit as keyof typeof multiplier];
}