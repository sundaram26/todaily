import { JwtToken, verifyJwtToken } from "@/modules/auth/auth.util";
import { AppError, BadRequestError, UnauthorizedError } from "@/utils/app-error";
import { NextFunction, Request, Response } from "express";

type AuthenticateRequest = Request & { user?: JwtToken }

export const isAuthenticated = (
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new BadRequestError("Authorization token is required!")
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new AppError("Invalid token!");
        }

        const decode = verifyJwtToken(token);

        req.user = decode

        next();
    } catch (error) {
        next(new UnauthorizedError("Invalid or expired token"))
    }
}