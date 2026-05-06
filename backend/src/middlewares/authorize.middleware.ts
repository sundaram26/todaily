import { JwtToken, verifyJwtToken } from "@/modules/auth/auth.util";
import { AppError, UnauthorizedError } from "@/utils/app-error";
import { NextFunction, Request, Response } from "express";

type AuthenticateRequest = Request & { user?: JwtToken }

export const isAuthenticated = (
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.cookies?.access_token;

        if (!authHeader) {
            throw new UnauthorizedError("Authorization token is required!")
        }

        const token = authHeader;

        const decode = verifyJwtToken(token);

        req.user = decode

        next();
    } catch (error) {
        next(new UnauthorizedError("Invalid or expired token"))
    }
}