import * as p from "drizzle-orm/pg-core";
import { userTable } from "./user.schema";
import { timestamps } from "./columns.helpers";

const deviceType = p.pgEnum("device_type", ["android", "ios", "web"])

export const userDevice = p.pgTable("user_device", {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: p.integer()
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
    fcm_token: p.text(),
    device_type: deviceType(),
    device_name: p.varchar({ length: 255 }),
    is_active: p.boolean().default(true),
    last_used_at: p.timestamp(),
    ...timestamps
})

export const notificationTable = p.pgTable("notifications", {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: p.integer()
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
    title: p.varchar({ length: 255 }).notNull(),
    description: p.text(),
    is_seen: p.boolean().default(false),
    ...timestamps
}, (t) => ({
    notificationIdx: p.index("notif_user_idx").on(t.user_id, t.is_seen, t.created_at)
}))