import type { PageType, Page, Block, RegisterPageTypes } from "../../../../../src/runtime/types"
import { syncPageWithDefinition } from "../../../../../src/runtime/utils/page"
import * as Definitions from "../../../../app/types/page-definitions"

// Mock database update function
interface MockDB {
    update: (table: any) => {
        set: (data: any) => {
            where: (condition: any) => Promise<any>
        }
    }
}

const db = {} as MockDB
const pages = {} as any // Mock Drizzle table

export default defineEventHandler(async (event) => {
    const type = getRouterParam(event, 'type') as PageType
    const slug = getRouterParam(event, 'slug')

    if (!slug || !type) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing required parameters: type and slug"
        })
    }

    const body = await readBody<{
        blocks?: Block[]
        properties?: RegisterPageTypes[PageType]
    }>(event)

    if (!body) {
        throw createError({ statusCode: 400, statusMessage: "Request body is required" })
    }

    // Find the definition for this type to ensure synchronization before saving
    const defKey = `${type.toUpperCase()}_DEFINITION` as keyof typeof Definitions
    const definition = Definitions[defKey] as any

    // Synchronization Point: 
    // Before saving, we sync the incoming data with the definition.
    // This ensures that even if the client sends stale or poorly ordered data, 
    // the database remains clean and strictly follows the schema.
    const syncedPage = syncPageWithDefinition({
        type,
        properties: body.properties,
        blocks: body.blocks || [],
        // ... mock other required Page fields
    } as Page, definition)

    console.log(`Saving synchronized ${type} page ${slug}:`, {
        properties: syncedPage.properties,
        blocks: syncedPage.blocks
    })

    // In a real Drizzle app:
    // await db.update(pages)
    //   .set({
    //     content: {
    //       blocks: syncedPage.blocks,
    //       properties: syncedPage.properties
    //     },
    //     updatedAt: new Date()
    //   })
    //   .where(and(eq(pages.slug, slug), eq(pages.type, type)))

    return {
        success: true,
        message: `Page ${slug} (${type}) synchronized and updated successfully`,
        syncedProperties: syncedPage.properties,
        syncedBlocks: syncedPage.blocks
    }
})
