import * as p from "drizzle-orm/pg-core";
import { userTable } from "./user.table";
import { timestamps } from "./columns.helpers";
import { relations } from "drizzle-orm";

export const workspaceTable = p.pgTable(
    "workspaces",
    {
        id: p.uuid().primaryKey().defaultRandom(),
        name: p.varchar({ length: 100 }).notNull(),
        slug: p.varchar({ length: 100 }).notNull().unique(),
        logo: p.varchar({ length: 255 }),
        created_by: p.uuid().references(() => userTable.id, { onDelete: "set null" }),
        is_deleted: p.boolean().default(false),
        ...timestamps
    }
)

export const workspaceRoleEnum = p.pgEnum("workspace_role", ["owner", "admin", "member"])

export const workspaceMemberTable = p.pgTable(
    "workspace_members",
    {
        workspace_id: p.uuid().notNull().references(() => workspaceTable.id, { onDelete: "cascade" }),
        user_id: p.uuid().notNull().references(() => userTable.id, { onDelete: "cascade" }),
        role: workspaceRoleEnum().notNull().default("member"),
        joined_at: p.timestamp().defaultNow().notNull(),
        ...timestamps
    }, (t) => [
        p.primaryKey({ columns: [t.workspace_id, t.user_id] }),
        {
            wmWorkspaceIdx: p.index("wm_workspace_idx").on(t.workspace_id),
            wmUserIdx: p.index("wm_user_idx").on(t.user_id)
        }
    ]
)
