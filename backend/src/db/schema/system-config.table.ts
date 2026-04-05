import * as p from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";

const smtpPortEnum = p.pgEnum("smtp_port_enum", ["465", "587", "25", "2525"])
const smtpTypeEnum = p.pgEnum("smtp_type_enum", ["auth", "general", "marketing", "updates"])

export const smtpConfigTable = p.pgTable("smtp_configs", {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
    host: p.varchar({ length: 50 }).notNull(),
    port: smtpPortEnum().notNull(),
    username: p.varchar({ length: 50 }).notNull(),
    password: p.text().notNull(),
    from_email: p.varchar({ length: 50 }).notNull(),
    smtp_type: smtpTypeEnum().notNull(),
    is_active: p.boolean().notNull().default(true),
    ...timestamps
})