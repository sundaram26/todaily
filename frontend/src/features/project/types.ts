import z from "zod";

export const CreateProject = z.object({
    workspace_id: z.uuid().optional(),
    title: z.string(),
    description: z.string().optional(),
}) 

export const UpdateProject = CreateProject.partial().extend({
    id: z.uuid()
})

export const FieldTypeEnum = z.enum(["label", "status", "priority"]);

export const CreateCustomField = z.object({
  title: z.string().min(1).max(255, "Maximum length exceeded!"),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i),
  type: FieldTypeEnum,
  position: z.number().int().min(0).optional(),
});

export const UpdateCustomField = CreateCustomField.partial().extend({
    id: z.uuid()
})


export type Project = {
    id: string,
    title: string,
    description?: string,
    workspace_id?: string,
    created_by: string,
    created_at: string,
    updated_at: string
};
export type CreateProjectType = z.infer<typeof CreateProject>;
export type UpdateProjectType = z.infer<typeof UpdateProject>;
export type CreateCustomFieldType = z.infer<typeof CreateCustomField>;
export type UpdateCustomFieldType = z.infer<typeof UpdateCustomField>;