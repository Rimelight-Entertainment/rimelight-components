import { PAGE_TEMPLATES } from "../types/pageTemplates"
import type { Page, Localized } from "../types/pages"

export const getLocalizedContent = (field: Localized | undefined, currentLocale: string): string => {
  if (!field) return ''
  return field[currentLocale as keyof Localized] || field['en' as keyof Localized] || ''
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