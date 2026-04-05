import * as p from "drizzle-orm/pg-core";
import { customFieldTable, projectTable } from "./project.table";
import { timestamps } from "./columns.helpers";
import { userTable } from "./user.table";

export const taskTable = p.pgTable(
  "tasks",
  {
    id: p.uuid().primaryKey(),
    project_id: p
      .integer()
      .notNull()
      .references(() => projectTable.id, { onDelete: "cascade" }),
    status_id: p.integer().references(() => customFieldTable.id),
    priority_id: p.integer().references(() => customFieldTable.id),
    title: p.varchar({ length: 255 }).notNull(),
    description: p.text(),
    position: p.integer().notNull(),
    created_by: p
      .integer()
      .notNull()
      .references(() => userTable.id, { onDelete: "set null" }),
    updated_by: p
      .integer()
      .notNull()
      .references(() => userTable.id, { onDelete: "set null" }),
    start_date: p.timestamp(),
    due_date: p.timestamp(),
    is_deleted: p.boolean().default(false),
    ...timestamps,
  },
  (t) => ({
    projectIdx: p.index("task_project_idx").on(t.project_id),
    statusIdx: p.index("task_status_idx").on(t.status_id),
    dueDateIdx: p.index("task_due_idx").on(t.due_date),
  }),
);

export const taskAttachmentTable = p.pgTable(
  "task_attachments",
  {
    id: p.uuid().primaryKey().defaultRandom(),
    task_id: p
      .integer()
      .notNull()
      .references(() => taskTable.id, { onDelete: "cascade" }),
    file_url: p.text().notNull(),
    uploaded_by: p
      .integer()
      .notNull()
      .references(() => userTable.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => ({
    attachmentIdx: p.index("attachment_idx").on(t.task_id),
  }),
);

export const taskCommentTable = p.pgTable(
  "task_comments",
  {
    id: p.uuid().primaryKey().defaultRandom(),
    task_id: p
      .integer()
      .notNull()
      .references(() => taskTable.id, { onDelete: "cascade" }),
    user_id: p
      .integer()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    comment: p.text().notNull(),
    ...timestamps,
  },
  (t) => ({
    commentTaskIdx: p.index("comment_task_idx").on(t.task_id),
    commentUserIdx: p.index("comment_user_idx").on(t.user_id),
  }),
);

export const taskLabelTable = p.pgTable(
  "task_labels",
  {
    task_id: p
      .uuid()
      .notNull()
      .references(() => taskTable.id, { onDelete: "cascade" }),
    field_id: p
      .uuid()
      .notNull()
      .references(() => customFieldTable.id, { onDelete: "cascade" }),
  },
  (t) => [
    p.primaryKey({
      columns: [t.task_id, t.field_id],
    }),
  ],
);

export const userToTaskTable = p.pgTable(
  "users_to_tasks",
  {
    user_id: p
      .uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    task_id: p
      .uuid()
      .notNull()
      .references(() => taskTable.id, { onDelete: "cascade" }),
  },
  (t) => [
    p.primaryKey({ columns: [t.user_id, t.task_id] }),
    {
      userToTaskIdx: p.index("utt_user_idx").on(t.user_id),
      taskToUserIdx: p.index("utt_task_idx").on(t.task_id),
    },
  ],
);
