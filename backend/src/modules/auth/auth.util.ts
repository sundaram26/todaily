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