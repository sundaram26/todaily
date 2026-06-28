import * as p from "drizzle-orm/pg-core";
import { customFieldTable, projectTable } from "./project.table";
import { timestamps } from "./columns.helpers";
import { userTable } from "./user.table";

export const taskTable = p.pgTable(
  "tasks",
  {
    id: p.uuid().primaryKey().defaultRandom(),
    project_id: p
      .uuid()
      .notNull()
      .references(() => projectTable.id, { onDelete: "cascade" }),
    status_id: p.uuid().references(() => customFieldTable.id),
    priority_id: p.uuid().references(() => customFieldTable.id),
    title: p.varchar({ length: 255 }).notNull(),
    description: p.text(),
    position: p.integer().default(0).notNull(),
    created_by: p
      .uuid()
      .references(() => userTable.id, { onDelete: "set null" }),
    updated_by: p
      .uuid()
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

export const propertyEnum = p.pgEnum("property_type", ["text", "number", "select", "multi_select", "date", "person", "file", "url", "checkbox"]);

export const propertyDefinitionTable = p.pgTable(
  "property_definitions",
  {
    id: p.uuid().primaryKey().defaultRandom(),
    project_id: p.uuid().notNull().references(() => projectTable.id, { onDelete: "cascade" }),
    name: p.varchar({ length: 255 }).notNull(),
    type: propertyEnum().notNull(),
    config: p.jsonb(),
    position: p.integer().default(0).notNull(),
    is_required: p.boolean().default(false),
    ...timestamps
  }, (t) => ({
    projectIdx: p.index("property_project_idx").on(t.project_id),
    projectTypeIdx: p.index("property_project_type_idx").on(t.project_id, t.type)
  })
)

export const taskPropertyValueTable = p.pgTable(
  "task_property_values",
  {
    task_id: p
      .uuid()
      .notNull()
      .references(() => taskTable.id, { onDelete: "cascade" }),

    property_id: p
      .uuid()
      .notNull()
      .references(() => propertyDefinitionTable.id, { onDelete: "cascade" }),

    value: p.jsonb(),

    ...timestamps,
  },
  (t) => [
    p.primaryKey({
      columns: [t.task_id, t.property_id],
    }),
    {
      propertyIdx: p.index("tpv_property_idx").on(t.property_id),
      taskIdx: p.index("tpv_task_idx").on(t.task_id),
    }
  ],
);

export const taskAttachmentTable = p.pgTable(
  "task_attachments",
  {
    id: p.uuid().primaryKey().defaultRandom(),
    task_id: p
      .uuid()
      .notNull()
      .references(() => taskTable.id, { onDelete: "cascade" }),
    file_url: p.text().notNull(),
    uploaded_by: p
      .uuid()
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
      .uuid()
      .notNull()
      .references(() => taskTable.id, { onDelete: "cascade" }),
    user_id: p
      .uuid()
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

export const viewTypeEnum = p.pgEnum("view_type_enum", ["table", "gallery", "kanban"])
export const columnTypeEnum = p.pgEnum("column_type_enum", ["builtin", "property"])

export const viewColumnTable = p.pgTable(
  "view_columns",
  {
    id: p.uuid().primaryKey().defaultRandom(),
    project_id: p.uuid().notNull().references(() => projectTable.id, { onDelete: "cascade" }),
    view_type: viewTypeEnum().notNull(),
    column_type: columnTypeEnum().notNull(),
    column_key: p.varchar({ length: 255 }),
    position: p.integer().notNull().default(0),
    is_visible: p.boolean().default(true),
    ...timestamps
  }, (t) => ({
    projectIdx: p.index("view_column_project_idx").on(t.project_id),
    projectViewIdx: p.index("view_column_project_view_idx").on(t.project_id)
  })
) 