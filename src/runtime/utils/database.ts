import { uuid, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const id = uuid("id").default(sql`uuidv7()`).notNull();

export const timestamps = {
    updated_at: timestamp("updated_at", {
        withTimezone: true
    }).$onUpdate(() => new Date()),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    deleted_at: timestamp("deleted_at", { withTimezone: true })
};