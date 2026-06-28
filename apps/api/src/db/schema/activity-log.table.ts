import * as p from "drizzle-orm/pg-core";
import { userTable } from "./user.table";
import { projectTable } from "./project.table";
import { taskTable } from "./task.table";
import { timestamps } from "./columns.helpers";
import { workspaceTable } from "./workspace.table";

export const activityLogTable = p.pgTable(
  "activity_logs",
  {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
    workspace_id: p
      .uuid()
      .references(() => workspaceTable.id),
    user_id: p
      .uuid()
      .notNull()
      .references(() => userTable.id),
    project_id: p
      .uuid()
      .notNull()
      .references(() => projectTable.id),
    task_id: p.uuid().references(() => taskTable.id),
    action: p.varchar({ length: 255 }).notNull(),
    metadata: p.json(),
    ...timestamps,
  },
  (t) => ({
    actWorkspaceIdx: p.index("act_workspace_idx").on(t.workspace_id),
    actProjIdx: p.index("act_proj_idx").on(t.project_id),
    actTaskIdx: p.index("act_task_idx").on(t.task_id),
  }),
);
