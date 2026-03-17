import { uuid, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const id = uuid("id")
  .default(sql`uuidv7()`)
  .notNull();

export const timestamps = {
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).$onUpdate(() => new Date()),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
};
