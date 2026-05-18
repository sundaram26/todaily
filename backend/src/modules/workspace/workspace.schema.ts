import z from "zod";

export const WorkspaceSchema = z.object({
    name: z.string().min(1).max(100, "Maximum length exceeded!"),
    slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
    logo: z.string().optional(),
});

export const WorkspaceDbSchema = WorkspaceSchema.extend({
  created_by: z.uuid(),
});

export const UpdateWorkspaceSchema = WorkspaceSchema.partial();

export const WorkspaceMemberRoleEnum = z.enum(["owner", "admin", "member"]);

export const WorkspaceMemberSchema = z.object({
    workspace_id: z.uuid(),
    role: WorkspaceMemberRoleEnum.default("member")
});

export const WorkspaceMemberDbSchema = WorkspaceMemberSchema.extend({
    user_id: z.uuid(),
})

export const ProjectSchema = z.object({
    workspace_id: z.uuid().optional(),
    title: z.string().min(1).max(255, "Maximum length exceeded!"),
    description: z.string().optional(),
});

export const ProjectDbSchema = ProjectSchema.extend({
    created_by: z.uuid()
})

export const UpdateProjectSchema = ProjectSchema.partial().extend({
    id: z.string()
});

export const ProjectRoleEnum = z.enum(["owner", "admin", "member"]);

export const ProjectMemberSchema = z.object({
    project_id: z.uuid(),
    role: ProjectRoleEnum.default("member"),
});

export const ProjectMemberDbSchema = ProjectMemberSchema.extend({
    user_id: z.uuid(),
});

export const FieldTypeEnum = z.enum(["status", "priority", "label"]);

export const CustomFieldSchema = z.object({
  project_id: z.uuid(),
  title: z.string().min(1).max(255, "Maximum length exceeded!"),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i),
  type: FieldTypeEnum,
  position: z.number().int().min(0).default(0).optional(),
});

export const UpdateCustomFieldSchema = CustomFieldSchema.partial().extend({
    id: z.uuid()
});

export const TaskSchema = z.object({
    project_id: z.uuid(),
    status_id: z.uuid().optional(),
    priority_id: z.uuid().optional(),
    title: z.string(),
    description: z.string().optional(),
    position: z.number().int().min(0).default(0),
});

export const TaskDbSchema = TaskSchema.extend({
  created_by: z.uuid(),
  updated_by: z.uuid(),
});

export const UpdateTaskSchema = TaskSchema.partial();

export const TaskAttachmentSchema = z.object({
    task_id: z.uuid(),
    file_url: z.string(),
});

export const TaskAttachmentDbSchema = TaskAttachmentSchema.extend({
  uploaded_by: z.uuid(),
});

export const TaskCommentSchema = z.object({
    task_id: z.uuid(),
    comment: z.string().min(1).max(5000, "Maximum length exceeded!"),
});

export const TaskCommentDbSchema = TaskCommentSchema.extend({
    user_id: z.uuid()
})

export const TaskLabelSchema = z.object({
    task_id: z.uuid(),
    field_id: z.uuid(),
});

export const TaskAssignSchema = z.object({
    user_id: z.uuid(),
    task_id: z.uuid()
});


export type Workspace = z.infer<typeof WorkspaceSchema>;
export type WorkspaceDb = z.infer<typeof WorkspaceDbSchema>;
export type WorkspaceMember = z.infer<typeof WorkspaceMemberSchema>;
export type WorkspaceMemberRole = z.infer<typeof WorkspaceMemberRoleEnum>;
export type WorkspaceMemberDb = z.infer<typeof WorkspaceMemberDbSchema>;
export type UpdateWorkspace = z.infer<typeof UpdateWorkspaceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectDb = z.infer<typeof ProjectDbSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
export type CustomField = z.infer<typeof CustomFieldSchema>;
export type UpdateCustomField = z.infer<typeof UpdateCustomFieldSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type TaskDb = z.infer<typeof TaskDbSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
export type TaskAttachmentDb = z.infer<typeof TaskAttachmentDbSchema>;
export type TaskComment = z.infer<typeof TaskCommentSchema>;
export type TaskCommentDb = z.infer<typeof TaskCommentDbSchema>;
export type TaskLabel = z.infer<typeof TaskLabelSchema>;
export type TaskAssign = z.infer<typeof TaskAssignSchema>;