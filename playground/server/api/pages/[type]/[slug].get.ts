import type { PageType, Page } from "../../../../../src/runtime/types"
import { syncPageWithDefinition } from "../../../../../src/runtime/utils"
import * as Definitions from "../../../../app/types/page-definitions"

// This represents what your 'db' would return
interface MockDB {
    query: {
        pages: {
            findFirst: (args: any) => Promise<any>
        }
    }
}

// In a real app, you would import this from your schema/database file
const db = {} as MockDB

export default defineEventHandler(async (event): Promise<Page> => {
    const type = getRouterParam(event, 'type') as PageType
    const slug = getRouterParam(event, 'slug')

    if (!slug || !type) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing required parameters: type and slug"
        })
    }

    // Type-safety: The fetched page will adhere to the union defined in RegisterPageTypes
    const pageFromDB = await db.query.pages.findFirst({
        where: { slug, type }
    })

    if (!pageFromDB) {
        throw createError({ statusCode: 404, statusMessage: "Page not found" })
    }

    // Find the definition for this type to ensure synchronization
    const defKey = `${type.toUpperCase()}_DEFINITION` as keyof typeof Definitions
    const definition = Definitions[defKey] as any

    const page = {
        ...pageFromDB,
        // Ensure structure for the union
        blocks: pageFromDB.content.blocks || [],
        properties: pageFromDB.content.properties,
    } as Page

    // Synchronization Point: 
    // Automatically fix the data to conform to the latest PageDefinition.
    // This handles added/removed properties and templated blocks.
    return syncPageWithDefinition(page, definition)
})
