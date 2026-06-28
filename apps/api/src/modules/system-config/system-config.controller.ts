import z from "zod";
import { asyncHandler } from "@/utils/async-handler";
import { Request, Response } from "express";
import { SystemConfigRepository } from "./system-config.repository";
import { BadRequestError } from "@/utils/app-error";
import { ApiResponse } from "@/utils/api-response";
import { SystemConfigService } from "./system-config.service";
import { RegisterSmtpSchema, UpdateSmtpSchema } from "./system-config.schema";

const IdSchema = z.object({
  id: z.string().min(1),
});

const systemConfigService = new SystemConfigService(new SystemConfigRepository());

export const createSmtpConfig = asyncHandler(async (req: Request, res: Response) => {
    const parsedReq = RegisterSmtpSchema.parse(req.body)
    const smtp = await systemConfigService.addSmtp(parsedReq);

    return res.json(
        new ApiResponse({
            status: 201,
            message: "Successfully created smtp config",
            data: smtp
        })
    );
})

export const updateSmtpConfig = asyncHandler(async (req: Request, res: Response) => {
    const { id } = IdSchema.parse(req.params.id);
    const parsedReq = UpdateSmtpSchema.parse(req.body)
    const updatedSmtp = await systemConfigService.updateSmtp(id, parsedReq);

    return res.json(
        new ApiResponse({
            status: 200,
            message: "Successfully updated smtp config",
            data: updatedSmtp
        })
    )
})

export const getAllSmtpConfig = asyncHandler(async (req: Request, res: Response) => {
    const smtps = await systemConfigService.getAllSmtp();

    return res.json(
        new ApiResponse({
            status: 200,
            message: "Successfully fetched all smtps",
            data: smtps
        })
    )
})

export const deleteSmtpConfig = asyncHandler(async (req: Request, res: Response) => {
    const { id } = IdSchema.parse(req.params.id);
    await systemConfigService.deleteSmtp(id);

    return res.json(
        new ApiResponse({
            status: 200,
            message: "Successfully deleted smtp config"
        })
    )
})