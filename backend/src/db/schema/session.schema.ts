import * as p from "drizzle-orm/pg-core";
import { userTable } from "./user.schema";
import { timestamps } from "./columns.helpers";

export const sessionTable = p.pgTable("sessions", {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: p.integer()
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
    refresh_token: p.text().notNull().unique(),
    expires_at: p.timestamp().notNull(),
    device_info: p.json(),
    ip_address: p.varchar({ length: 255 }),
    ...timestamps    
})
