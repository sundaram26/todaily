import * as p from "drizzle-orm/pg-core";
import { userTable } from "./user.table";
import { timestamps } from "./columns.helpers";

export const projectTable = p.pgTable("projects", {
  id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
  title: p.varchar({ length: 255 }).notNull(),
  description: p.text(),
  created_by: p
    .integer()
    .notNull()
    .references(() => userTable.id, { onDelete: "set null" }),
  is_deleted: p.boolean().default(false),
  ...timestamps,
});

const typeEnum = p.pgEnum("custom_field_type", ["status", "priority", "label"]);

export const customFieldTable = p.pgTable("custom_fields", {
  id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
  project_id: p
    .integer()
    .notNull()
    .references(() => projectTable.id, { onDelete: "cascade" }),
  title: p.varchar({ length: 255 }).notNull(),
  color: p.varchar({ length: 255 }).notNull(),
  type: typeEnum().notNull(),
  position: p.integer(),
  ...timestamps,
});

export const projectMembers = p.pgTable(
  "project_members",
  {
    user_id: p
      .integer()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    project_id: p
      .integer()
      .notNull()
      .references(() => projectTable.id, { onDelete: "cascade" }),
    role: p.varchar({ length: 50 }).default("member"),
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
