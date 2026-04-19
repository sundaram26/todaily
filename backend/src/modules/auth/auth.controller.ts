import { asyncHandler } from "@/utils/async-handler";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { ApiResponse } from "@/utils/api-response";
import { AppError, BadRequestError } from "@/utils/app-error";
import { env } from "@/config/env";
import { getCookieMaxAge, getExpiryDate } from "./auth.util";

const authService = new AuthService(new AuthRepository());

export const register = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);

    return res.json(
        new ApiResponse({
            status: 201,
            message: "Successfully registered!",
            data: user
        })
    )
})

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.sendOtp(req.body);

    if (!result) {
        throw new AppError("Unable to send otp! try resend opt.");
    }

    return res.json(
        new ApiResponse({
            status: 200,
            message: "Successfully sent otp to registered email."
        })
    )
})

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.resendOtp(req.body);

    if (!result) {
        throw new AppError("Unable to send otp!");
    }

    return res.json(
        new ApiResponse({
            status: 200,
            message: "Successfully sent new otp to registered email."
        })
    )
})

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const isVerified = await authService.verifyOtp(req.body);

    if (!isVerified) {
        throw new BadRequestError("Invalid or expired otp!")
    }

    return res.json(
        new ApiResponse({
            status: 200,
            message: "Successfully verified email."
        })
    )
})

export const login = asyncHandler(async (req: Request, res: Response) => {
    const loggedin = await authService.login(req.body);

    if (!loggedin) {
        throw new AppError("Unable to login!");
    }

    res.cookie("access_token", loggedin.accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: getCookieMaxAge(env.JWT_ACCESS_EXPIRY),
        sameSite: "lax"
    })

    res.cookie("refresh_token", loggedin.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: getCookieMaxAge(env.JWT_REFRESH_EXPIRY),
        sameSite: "lax"
    })

    res.json(
        new ApiResponse({
            status: 200,
            message: "User logged in."
        })
    )
})

export const logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token;

    await authService.logout(refreshToken);

    res.clearCookie("access_token", {
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    })

    res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    })

    return res.json(
        new ApiResponse({
            status: 200,
            message: "Successfully logged out!"
        })
    )
})