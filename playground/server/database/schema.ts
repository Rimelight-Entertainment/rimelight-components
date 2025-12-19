import { pgTable, text, uuid, jsonb, timestamp } from "drizzle-orm/pg-core"
import type { PageType, Block, Localized, RegisterPageTypes } from "../../../src/runtime/types"

export const timestamps = {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}

export const pages = pgTable("pages", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    type: text("type").$type<PageType>().notNull(),
    title: jsonb("title").$type<Localized>().notNull(),
    description: jsonb("description").$type<Localized>(),
    tags: jsonb("tags").$type<Localized<string>[]>().default([]).notNull(),
    authorIds: jsonb("author_ids").$type<string[]>().default([]).notNull(),
    content: jsonb("content").$type<{
        blocks: Block[]
        properties: RegisterPageTypes[PageType];
    }>().notNull(),
    posted_at: timestamp("posted_at", { withTimezone: true }),
    ...timestamps
});
