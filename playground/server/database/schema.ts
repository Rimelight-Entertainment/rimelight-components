import { pgTable, text, uuid, jsonb, timestamp } from "drizzle-orm/pg-core"
import type { PageType, Block, Localized, RegisterPageTypes } from "../../../src/runtime/types"
import { timestamps } from "../../../src/runtime/utils"

export const pages = pgTable("pages", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    // Type-safe: PageType is inferred from your playground definitions
    type: text("type").$type<PageType>().notNull(),
    title: jsonb("title").$type<Localized>().notNull(),
    description: jsonb("description").$type<Localized>(),
    tags: jsonb("tags").$type<Localized<string>[]>().default([]).notNull(),
    authorIds: jsonb("author_ids").$type<string[]>().default([]).notNull(),
    // Content: Combining logic blocks with type-safe properties defined in playground
    content: jsonb("content").$type<{
        blocks: Block[]
        properties: RegisterPageTypes[PageType];
    }>().notNull(),
    posted_at: timestamp("posted_at", { withTimezone: true }),
    ...timestamps
});
