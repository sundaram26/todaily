import * as p from "drizzle-orm/pg-core"
import { timestamps } from "./columns.helpers"

export const userTable = p.pgTable(
  "users",
  {
    id: p.uuid().primaryKey().defaultRandom(),
    first_name: p.varchar({ length: 255 }),
    last_name: p.varchar({ length: 255 }),
    profile: p.varchar({ length: 255 }),
    email: p.varchar({ length: 255 }).notNull().unique(),
    password: p.text(),
    username: p.varchar({ length: 20 }).notNull().unique(),
    is_verified: p.boolean().default(false),
    is_active: p.boolean().default(false),
    ...timestamps,
}, (t) => ({
    userEmailIdx: p.index("user_email_idx").on(t.email),
}));

const otpType = p.pgEnum("otp_type", ["email_verification", "password_reset"])

export const otpTable = p.pgTable(
  "otps",
  {
    id: p.uuid().primaryKey().defaultRandom(),
    user_id: p.uuid().notNull().references(() =>  userTable.id, { onDelete: "cascade"}),
    otp: p.varchar({ length: 6 }).notNull(),
    type: otpType().notNull(),
    otp_expiry: p.timestamp({ withTimezone: true }).notNull(),
    ...timestamps
  }
)

const providerType = p.pgEnum("provider_type", ["google", "local"]);
export const accountTable = p.pgTable(
  "accounts",
  {
    id: p.uuid().primaryKey().defaultRandom(),
    user_id: p.uuid().notNull().references(() => userTable.id, { onDelete: "cascade" }),
    provider: providerType(),
    provider_account_id: p.text().notNull(),
    ...timestamps
  }
)