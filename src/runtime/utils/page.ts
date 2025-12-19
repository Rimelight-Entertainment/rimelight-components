import type { Page, Localized, PageDefinition } from "../types/pages"

export const getLocalizedContent = (field: Localized | undefined, currentLocale: string): string => {
  if (!field) return ''
  return field[currentLocale as keyof Localized] || field['en' as keyof Localized] || ''
}

/**
 * Ensures a page strictly adheres to its PageDefinition.
 * - Adds missing properties and groups in the correct order.
 * - Removes properties and groups no longer in the definition.
 * - Adds missing templated blocks in the correct relative position.
 * - Removes templated blocks no longer in the definition.
 */
export function syncPageWithDefinition(page: Page, definition?: PageDefinition): Page {
  if (!definition) return page

  let hasChanged = false

  // 1. Sync Properties
  const updatedProperties: any = {}
  const definitionGroups = definition.properties

  for (const [groupId, definitionGroup] of Object.entries(definitionGroups)) {
    const existingGroup = (page.properties as any)[groupId]
    const updatedGroupFields: any = {}

    for (const [fieldId, definitionField] of Object.entries(definitionGroup.fields)) {
      if (existingGroup?.fields[fieldId]) {
        // Keep existing value but update metadata from definition
        updatedGroupFields[fieldId] = {
          ...definitionField,
          value: existingGroup.fields[fieldId].value
        }
      } else {
        // Add new field with its default definition value
        updatedGroupFields[fieldId] = { ...definitionField }
        hasChanged = true
      }
    }

    updatedProperties[groupId] = {
      ...definitionGroup,
      fields: updatedGroupFields
    }

    if (!existingGroup) {
      hasChanged = true
    }
  }

  // Check if we removed any groups or fields
  if (Object.keys(page.properties).length !== Object.keys(updatedProperties).length) {
    hasChanged = true
  } else {
    for (const groupId in updatedProperties) {
      const pageGroup = (page.properties as any)[groupId]
      if (Object.keys(pageGroup?.fields || {}).length !== Object.keys(updatedProperties[groupId].fields).length) {
        hasChanged = true
        break
      }
    }
  }

  page.properties = updatedProperties as any

  // 2. Sync Blocks
  if (definition.initialBlocks) {
    const idealBlocks = definition.initialBlocks()
    const currentBlocks = [...page.blocks]

    // Map ideal blocks by ID for easy lookup
    const idealBlocksMap = new Map(idealBlocks.map(b => [b.id, b]))

    // Filter out templated blocks that are no longer in the definition
    const filteredCurrent = currentBlocks.filter(b => {
      if (!b.isTemplated) return true // Keep user-added blocks
      return idealBlocksMap.has(b.id) // Keep templated blocks only if still in definition
    })

    if (filteredCurrent.length !== currentBlocks.length) {
      hasChanged = true
    }

    // Insert missing templated blocks while maintaining relative order
    let lastExistingIdealIndex = -1

    for (const idealBlock of idealBlocks) {
      const existingIndex = filteredCurrent.findIndex(b => b.id === idealBlock.id)

      if (existingIndex !== -1) {
        lastExistingIdealIndex = existingIndex
      } else {
        // This templated block is missing from the page.
        // Insert it after the last "seen" ideal block to preserve relative order.
        filteredCurrent.splice(lastExistingIdealIndex + 1, 0, { ...idealBlock })
        lastExistingIdealIndex++
        hasChanged = true
      }
    }

    page.blocks = filteredCurrent
  }

  if (hasChanged) {
    page.updatedAt = new Date().toISOString()
  }

  return page
}