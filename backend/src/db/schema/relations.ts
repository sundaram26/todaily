import { relations } from "drizzle-orm";
import { workspaceMemberTable, workspaceTable } from "./workspace.table";
import { userTable } from "./user.table";
import { customFieldTable, projectMemberTable, projectTable } from "./project.table";
import { taskAttachmentTable, taskCommentTable, taskLabelTable, taskTable } from "./task.table";

export const workspaceMemberRelations = relations(
  workspaceMemberTable,
  ({ one }) => ({
    workspace: one(workspaceTable, {
      fields: [workspaceMemberTable.workspace_id],
      references: [workspaceTable.id],
    }),

    user: one(userTable, {
      fields: [workspaceMemberTable.user_id],
      references: [userTable.id],
    }),
  }),
);

export const workspaceToUserRelations = relations(workspaceTable, ({ many }) => ({
  members: many(workspaceMemberTable),
}));

export const userToWorkspaceRelations = relations(userTable, ({ many }) => ({
    workspaceMemberships: many(workspaceMemberTable)
}));


export const projectMemberRelations = relations(projectMemberTable, ({ one }) => ({
    project: one(projectTable, {
        fields: [projectMemberTable.project_id],
        references: [projectTable.id]
    }),
    user: one(userTable, {
        fields: [projectMemberTable.user_id],
        references: [userTable.id]
    })
}));

export const projectToUserRelations = relations(projectTable, ({ many }) => ({
    members: many(projectMemberTable),
}));

export const userToProjectRelations = relations(userTable, ({ many }) => ({
    projectMemberships: many(projectMemberTable),
}));

export const customFieldToProjectRelations = relations(customFieldTable, ({ one }) => ({
    project: one(projectTable, {
        fields: [customFieldTable.project_id],
        references: [projectTable.id]
    }),
}));


export const projectToCustomFieldRelations = relations(projectTable, ({ many }) => ({
    customFields: many(customFieldTable),
}));

export const taskLabelRelations = relations(taskLabelTable, ({ one }) => ({
  field: one(customFieldTable, {
    fields: [taskLabelTable.field_id],
    references: [customFieldTable.id],
  }),

  task: one(taskTable, {
    fields: [taskLabelTable.task_id],
    references: [taskTable.id],
  }),
}));

export const taskToLabelRelations = relations(taskTable, ({ many }) => ({
  labels: many(taskLabelTable),
}));

export const projectToWorkspaceRelations = relations(projectTable, ({ one }) => ({
    workspace: one(workspaceTable, {
        fields: [projectTable.workspace_id],
        references: [workspaceTable.id]
    })
}));

export const workspaceToProjectRelations = relations(workspaceTable, ({ many }) => ({
    projects: many(projectTable)
}));

export const projectToTaskRelations = relations(projectTable, ({ many }) => ({
    tasks: many(taskTable)
}));

export const taskToProjectRelations = relations(taskTable, ({ one }) => ({
    project: one(projectTable, {
        fields: [taskTable.project_id],
        references: [projectTable.id]
    })
}));

export const taskToAttachments = relations(taskTable, ({ many }) => ({
    attachments: many(taskAttachmentTable)
}));

export const taskToComments = relations(taskTable, ({ many }) => ({
    comments: many(taskCommentTable)
}));
