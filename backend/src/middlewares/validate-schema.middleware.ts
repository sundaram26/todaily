import { BadRequestError } from "@/utils/app-error"
import { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"


export const validateSchema = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);

        next();
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const errors = error.issues.map((err) => ({
                field: err.path.join("."),
                message: err.message
            }))
            throw new BadRequestError(JSON.stringify(errors))
        }
        throw new BadRequestError("Not valid schema!")
    }
}