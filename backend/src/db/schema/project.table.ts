import * as p from "drizzle-orm/pg-core";
import { userTable } from "./user.table";
import { timestamps } from "./columns.helpers";
import { workspaceTable } from "./workspace.table";

export const projectTable = p.pgTable("projects", {
  id: p.uuid().primaryKey().defaultRandom(),
  workspace_id: p.uuid().references(() => workspaceTable.id, { onDelete: "set null" }),
  title: p.varchar({ length: 255 }).notNull(),
  description: p.text(),
  position: p.integer().default(0).notNull(),
  created_by: p
    .uuid()
    .references(() => userTable.id, { onDelete: "set null" }),
  is_deleted: p.boolean().default(false),
  ...timestamps,
}, (t) => ({
  projectWorkspaceIdx: p.index("project_workspace_idx").on(t.workspace_id),
}));

export const typeEnum = p.pgEnum("custom_field_type", ["status", "priority", "label"]);

export const customFieldTable = p.pgTable("custom_fields", {
  id: p.uuid().primaryKey().defaultRandom(),
  project_id: p
    .uuid()
    .notNull()
    .references(() => projectTable.id, { onDelete: "cascade" }),
  title: p.varchar({ length: 255 }).notNull(),
  color: p.varchar({ length: 255 }).notNull(),
  type: typeEnum().notNull(),
  position: p.integer().default(0).notNull(),
  ...timestamps,
});

export const projectRoleEnum = p.pgEnum("project_role", ["owner", "admin", "member"])

export const projectMemberTable = p.pgTable(
  "project_members",
  {
    user_id: p
      .uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    project_id: p
      .uuid()
      .notNull()
      .references(() => projectTable.id, { onDelete: "cascade" }),
    role: projectRoleEnum().default("member").notNull(),
    ...timestamps,
  },
  (t) => [
    p.primaryKey({ columns: [t.user_id, t.project_id] }),
    {
      pmProjectIdx: p.index("pm_project_idx").on(t.project_id),
      pmUserIdx: p.index("pm_user_idx").on(t.user_id),
    },
  ],
);
