// utils/template-sync.ts
import { PAGE_TEMPLATES } from "../types/pageTemplates"
import type { Page, PageType } from "../types/pages"
import type { Block } from "../types/blocks"
import { v7 as uuidv7 } from "uuid"


export function createPage(type: PageType, slug: string = "new-page"): Page {
  const now = new Date().toISOString()

  // Directly call the factory function for the specific type
  const templateFn = PAGE_TEMPLATES[type]
  const blocks = templateFn ? templateFn() : []

  return {
    id: uuidv7(),
    slug,
    type,
    tags: [],
    properties: {} as any,
    blocks: blocks,
    createdAt: now,
    updatedAt: now
  }
}


/**
 * Ensures an existing page has all the blocks currently defined in its template.
 * Matches based on SectionBlock titles.
 */
export function syncTemplateBlocks(page: Page): Page {
  // Call the template factory to see what the "ideal" structure looks like
  const templateFn = PAGE_TEMPLATES[page.type]
  if (!templateFn) return page

  const idealBlocks = templateFn()

  // Get titles of SectionBlocks already in the user's page
  const existingTitles = new Set(
    page.blocks
      .filter(b => b.type === 'SectionBlock')
      .map(b => b.props.title)
  )

  // Find blocks in the "ideal" list that aren't in the user's page
  const missingBlocks = idealBlocks.filter(
    (b) => b.type === 'SectionBlock' && !existingTitles.has(b.props.title)
  )

  if (missingBlocks.length > 0) {
    // Append the missing blocks to the end of the page
    page.blocks = [...page.blocks, ...missingBlocks]
    page.updatedAt = new Date().toISOString()
  }

  return page
}