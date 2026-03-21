import * as p from "drizzle-orm/pg-core";
import { userTable } from "./user.schema";

export const projectTable = p.pgTable("projects", {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
    title: p.varchar({ length: 255 }).notNull(),
    description: p.text(),
    created_by: p.integer()
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" })
})