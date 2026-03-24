import z from "zod";

const CreateProjectSchema = z.object({
    title: z.string(),
    description: z.string(),
    created_by: z.number()
})