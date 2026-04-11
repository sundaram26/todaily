import { asyncHandler } from "@/utils/async-handler";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { ApiResponse } from "@/utils/api-response";

const authService = new AuthService(new AuthRepository());

export const signUp = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);

    return res.json(
        new ApiResponse({
            status: 201,
            message: "Successfully signed up!",
            data: user
        })
    )
})