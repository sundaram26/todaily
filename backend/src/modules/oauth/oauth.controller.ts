import { Request, Response } from "express";
import { AuthRepository } from "../auth/auth.repository";
import { OAuthService } from "./oauth.service";
import { asyncHandler } from "@/utils/async-handler";
import { providerName, providers } from "./providers/oauth.provider";
import { AppError, BadRequestError } from "@/utils/app-error";
import { ApiResponse } from "@/utils/api-response";
import { env } from "@/config/env";
import { getCookieMaxAge } from "../auth/auth.util";

const oauthService = new OAuthService(new AuthRepository());

export const redirectToProvider = asyncHandler(async (req: Request, res: Response) => {
    const providerName = req.params.provider as providerName;

    const provider = providers[providerName];

    if (!provider) {
        throw new AppError("Invalid auth provider!");
    }

    const url = provider.getAuthUrl();

    return res.redirect(url);
})

export const handleOAuthCallback = asyncHandler(async (req: Request, res: Response) => {
    const providerName = req.params.provider as providerName;
    const { state, code } = req.query;

    const provider = providers[providerName];
    if (!provider) {
        throw new AppError("Invalid auth provider!");
    }

    if (!code || typeof code !== "string") {
        throw new BadRequestError("Authorization code missing!");
    }

    if (!state || typeof state !== "string") {
        throw new BadRequestError("Invalid state!");
    }

    const tokens = await oauthService.login(providerName, code, {
        ip_address: req.ip || "",
        device_info: { userAgent: req.headers["user-agent"] }
    })

    res.cookie("access_token", tokens.accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: getCookieMaxAge(env.JWT_ACCESS_EXPIRY),
        sameSite: "lax",
    });

    res.cookie("refresh_token", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: getCookieMaxAge(env.JWT_REFRESH_EXPIRY),
        sameSite: "lax",
    });

    return res.json(
        new ApiResponse({
            status: 200,
            message: "Successfully logged in"
        })
    )
})