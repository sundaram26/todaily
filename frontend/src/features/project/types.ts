import z from "zod";
import { customFields } from "./dummy-data";

export const FieldTypeEnum = z.enum(["label", "status", "priority"]);

export const CustomField = z.object({
  id: z.uuid().optional(),
  title: z.string().max(255, "Maximum length exceeded!"),
  project_id: z.uuid().optional(),
  color: z.string(),
  type: FieldTypeEnum,
  position: z.number().int().min(0).optional(),
});

export const CreateProject = z.object({
  workspace_id: z.uuid().optional(),
  title: z.string(),
  description: z.string().optional(),
  label_id: z.uuid().optional(),
  due_date: z.date().optional(),
  customFields: z.array(CustomField).optional()
})

export const UpdateProject = CreateProject.partial().extend({
  id: z.string().min(1, "ID is required"),
});

export const ReorderProject = z.object({
  projects: z.array(
    z.object({
      id: z.uuid(),
      position: z.number().int().min(0),
    }),
  ),
});

export const UpdateCustomField = CustomField.partial().extend({
  id: z.uuid().min(1, "ID is required"),
});

// task
export const ViewTypeEnum = z.enum(["table", "kanban", "gallery"])


export type CreateProjectType = z.infer<typeof CreateProject>;
export type UpdateProjectType = z.infer<typeof UpdateProject>;
export type ReorderProjectType = z.infer<typeof ReorderProject>;
export type CustomFieldType = z.infer<typeof CustomField>;
export type UpdateCustomFieldType = z.infer<typeof UpdateCustomField>;
export type ViewTypeEnumType = z.infer<typeof ViewTypeEnum>;

export type ProjectSchemaType = {
  id: string,
  title: string,
  description?: string,
  label_id?: string,
  due_date?: string,
  workspace_id?: string,
  created_by: string,
  created_at: string,
  updated_at: string
};