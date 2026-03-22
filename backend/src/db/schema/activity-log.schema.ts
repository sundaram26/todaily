import * as p from "drizzle-orm/pg-core";
import { userTable } from "./user.schema";
import { projectTable } from "./project.schema";
import { taskTable } from "./task.schema";
import { timestamps } from "./columns.helpers";

export const activityLogTable = p.pgTable("activity_logs", {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: p.integer()
        .notNull()
        .references(() => userTable.id),
    project_id: p.integer()
        .notNull()
        .references(() => projectTable.id),
    task_id: p.integer()
        .references(() => taskTable.id),
    action: p.varchar({ length: 255 }).notNull(),
    metadata: p.json(),
    ...timestamps
}, (t) => ({
    actProjIdx: p.index("act_proj_idx").on(t.project_id),
    actTaskIdx: p.index("act_task_idx").on(t.task_id),
}))