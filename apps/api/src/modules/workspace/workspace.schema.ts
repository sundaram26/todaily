import { viewTypeEnum } from "@/db/schema";
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

export const FieldTypeEnum = z.enum(["status", "priority", "label"]);

export const CustomFieldSchema = z.object({
    project_id: z.uuid().optional(),
    title: z.string().min(1).max(255, "Maximum length exceeded!"),
    color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i),
    type: FieldTypeEnum,
    position: z.number().int().min(0).default(0).optional(),
});

export const UpdateCustomFieldSchema = CustomFieldSchema.partial().extend({
    id: z.uuid(),
});

export const ProjectSchema = z.object({
    workspace_id: z.uuid().optional(),
    title: z.string().min(1).max(255, "Maximum length exceeded!"),
    description: z.string().optional(),
    label_id: z.uuid().optional(),
    due_date: z.string().optional().transform(val => val ? new Date(val) : undefined).optional(),
    customFields: z.array(CustomFieldSchema).optional(),
});

export const ProjectDbSchema = ProjectSchema.extend({
    created_by: z.uuid()
})

export const UpdateProjectSchema = ProjectSchema.partial().extend({
    id: z.string()
});

export const ReorderProjectsSchema = z.object({
    projects: z.array(z.object({
        id: z.uuid(),
        position: z.number().int().min(0),
    })),
});

export const ProjectRoleEnum = z.enum(["owner", "admin", "member"]);

export const ProjectMemberSchema = z.object({
    project_id: z.uuid(),
    role: ProjectRoleEnum.default("member"),
});

export const ProjectMemberDbSchema = ProjectMemberSchema.extend({
    user_id: z.uuid(),
});

export const TaskSchema = z.object({
    project_id: z.uuid(),
    status_id: z.uuid().optional(),
    priority_id: z.uuid().optional(),
    title: z.string(),
    description: z.string().optional(),
    position: z.number().int().min(0).default(0),
    properties: z.array(z.object({
        property_id: z.uuid(),
        value: z.json()
    })).optional()
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

export const propertyEnum = z.enum(["text", "number", "select", "multi_select", "date", "file", "url", "checkbox"]);

export const PropertyDefinition = z.object({
    id: z.uuid(),
    project_id: z.uuid(),
    name: z.string(),
    type: propertyEnum.default("text"),
    config: z.json(),
    position: z.number().default(0),
    is_required: z.boolean().default(false),
});

export const UpdatePropertyDefinition = PropertyDefinition.partial();

const urlOrPathSchema = z.string().url().or(z.string().startsWith("/"));

export const PropertyTypeSchema = {
    text: z.object({
        text: z.string()
    }),
    number: z.object({
        number: z.number()
    }),
    select: z.object({
        select: z.boolean(),
    }),
    multi_select: z.object({
        multi_select: z.array(z.boolean())
    }),
    date: z.object({
        date: z.date()
    }),
    file: z.object({
        file: urlOrPathSchema
    }),
    url: z.object({
        label: z.string(),
        url: z.url()
    }),
    checkbox: z.object({
        checked: z.boolean().default(false),
    }),
}

export const ViewColumnTypeEnum = z.enum(["built_in", "property"]);
export const ViewTypeEnum = z.enum(["table", "gallery", "kanban"])
export const BuiltInColumnEnum = z.enum(["title", "description", "status", "priority", "assignee", "due_date", "created_at", "updated_at"])

export const ViewColumnSchema = z.object({
    id: z.uuid().optional(),
    project_id: z.uuid(),
    view_type: ViewTypeEnum,
    column_type: ViewColumnTypeEnum,
    column_key: z.string(),
    position: z.number().int().min(0),
    is_visible: z.boolean().default(true),
})

export const UpdateViewColumnSchema = ViewColumnSchema.partial();

export const ReorderViewColumnsSchema = z.object({
    columns: z.array(z.object({
        id: z.string(),
        position: z.number().int().min(0)
    }))
})

export const AddPropertyToViewSchema = z.object({
    project_id: z.string(),
    property_id: z.string(),
    position: z.number(),
    view_type: ViewTypeEnum
});

export const ReorderPropertySchema = z.object({
    project_id: z.string(),
    view_type: ViewTypeEnum,
    columns: z.array(z.object({
        id: z.string(),
        position: z.number()
    }))
})

export type Workspace = z.infer<typeof WorkspaceSchema>;
export type WorkspaceDb = z.infer<typeof WorkspaceDbSchema>;
export type WorkspaceMember = z.infer<typeof WorkspaceMemberSchema>;
export type WorkspaceMemberRole = z.infer<typeof WorkspaceMemberRoleEnum>;
export type WorkspaceMemberDb = z.infer<typeof WorkspaceMemberDbSchema>;
export type UpdateWorkspace = z.infer<typeof UpdateWorkspaceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectDb = z.infer<typeof ProjectDbSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
export type ReorderProjects = z.infer<typeof ReorderProjectsSchema>;
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
export type PropertyDefinition = z.infer<typeof PropertyDefinition>;
export type UpdatePropertyDefinition = z.infer<typeof UpdatePropertyDefinition>;
export type ViewTypeEnumType = z.infer<typeof ViewTypeEnum>;
export type ViewColumnType = z.infer<typeof ViewColumnSchema>;
export type UpdateViewColumnType = z.infer<typeof UpdateViewColumnSchema>;
export type ReorderViewColumnType = z.infer<typeof ReorderViewColumnsSchema>;
export type AddPropertyToViewType = z.infer<typeof AddPropertyToViewSchema>;
export type ReorderPropertyType = z.infer<typeof ReorderPropertySchema>;