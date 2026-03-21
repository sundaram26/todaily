import * as p from "drizzle-orm/pg-core"
import { timestamps } from "./columns.helpers"

export const userTable = p.pgTable("users", {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
    fname: p.varchar({length: 255}).notNull(),
    lname: p.varchar({ length: 255 }).notNull(),
    email: p.varchar({ length: 255 }).notNull().unique(),
    password: p.text().notNull(),
    fcm_token: p.varchar({ length: 512 }),
    ...timestamps
})