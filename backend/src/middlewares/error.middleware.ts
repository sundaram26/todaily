import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error";

export const errorMiddleware = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (err instanceof AppError) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
            code: err.code,
            details: err.details
        })
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    })

}