import * as p from "drizzle-orm/pg-core"
import { timestamps } from "./columns.helpers"

export const userTable = p.pgTable(
  "users",
  {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
    fname: p.varchar({ length: 255 }).notNull(),
    lname: p.varchar({ length: 255 }).notNull(),
    email: p.varchar({ length: 255 }).notNull().unique(),
    password: p.text().notNull(),
    otp: p.varchar({ length: 6 }),
    otp_expiry: p.timestamp(),
    is_verified: p.boolean().default(false),
    ...timestamps,
}, (t) => ({
    userEmailIdx: p.index("user_email_idx").on(t.email),
}));