import { type MaybeRefOrGetter, toValue } from "vue"
import { type Localized, type Page, type PageDefinition, type PageVersion, type Property } from "../types"

export const getLocalizedContent = <T = string>(
  field: Localized<T> | undefined,
  currentLocale: MaybeRefOrGetter<string>
): T | string => {
  if (!field || typeof field !== "object") return ""

  const locale = toValue(currentLocale)

  return field[locale] ?? field["en"] ?? ""
}

type WidenProperty<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends never[]
  ? Localized[]
  : T extends object
  ? { [K in keyof T]: WidenProperty<T[K]> }
  : T

/**
 * Helper to define a page with full type safety and literal preservation.
 * This is used by consuming apps to define their custom page types.
 */
export function definePageDefinition<T extends PageDefinition>(
  def: T
): {
    [K in keyof T]: K extends "properties"
    ? {
      [G in keyof T["properties"]]: {
        label: Localized<string>
        defaultOpen: boolean
        fields: {
          [F in keyof T["properties"][G]["fields"]]: Property<
            WidenProperty<T["properties"][G]["fields"][F]["value"]>
          >
        }
      }
    }
    : T[K]
  } {
  return def as any
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

  const existingProperties = (page.properties || {}) as any

  for (const [groupId, definitionGroup] of Object.entries(definitionGroups)) {
    const existingGroup = existingProperties[groupId]
    const updatedGroupFields: any = {}

    // Ensure fields exist in the definition group
    const definitionFields = definitionGroup.fields || {}

    for (const [fieldId, definitionField] of Object.entries(definitionFields)) {
      // Defensive check: verify existingGroup and existingGroup.fields exist
      const existingField = existingGroup?.fields ? existingGroup.fields[fieldId] : undefined

      if (existingField !== undefined) {
        updatedGroupFields[fieldId] = {
          ...definitionField,
          value: existingField.value
        }
      } else {
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

  // Check for removed groups or field count mismatches
  const existingGroupKeys = Object.keys(existingProperties)
  const updatedGroupKeys = Object.keys(updatedProperties)

  if (existingGroupKeys.length !== updatedGroupKeys.length) {
    hasChanged = true
  } else {
    for (const groupId of updatedGroupKeys) {
      const existingFields = existingProperties[groupId]?.fields || {}
      const updatedFields = updatedProperties[groupId].fields

      if (Object.keys(existingFields).length !== Object.keys(updatedFields).length) {
        hasChanged = true
        break
      }
    }
  }

  page.properties = updatedProperties

  // 2. Sync Blocks
  if (definition.initialBlocks) {
    const idealBlocks = definition.initialBlocks()
    const currentBlocks = [...page.blocks]

    // Map ideal blocks by ID for easy lookup
    const idealBlocksMap = new Map(idealBlocks.map((b) => [b.id, b]))

    // Filter out templated blocks that are no longer in the definition
    const filteredCurrent = currentBlocks.filter((b) => {
      if (!b.isTemplated) return true // Keep user-added blocks
      return idealBlocksMap.has(b.id) // Keep templated blocks only if still in definition
    })

    if (filteredCurrent.length !== currentBlocks.length) {
      hasChanged = true
    }

    // Insert missing templated blocks while maintaining relative order
    let lastExistingIdealIndex = -1

    for (const idealBlock of idealBlocks) {
      const existingIndex = filteredCurrent.findIndex((b) => b.id === idealBlock.id)

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
    page.updatedAt = new Date()
  }

  return page
}

/**
 * Converts a PageVersion to a Page structure for display in the editor.
 */
export function convertVersionToPage(version: PageVersion): Page {
  // Ensure we fallback to empty arrays/objects if missing
  const blocks = version.content?.blocks || version.blocks || []
  const properties = version.content?.properties || (version as any).properties

  return {
    ...version,
    // Use the pageId if available as this is a version OF a page, 
    // but fall back to id if pageId is missing (e.g. if type is just BasePage)
    // However, version.id is the version's ID. version.pageId is the page's ID.
    id: version.pageId || version.id,
    type: version.type,
    blocks: JSON.parse(JSON.stringify(blocks)), // Deep copy to avoid reference issues
    properties: properties ? JSON.parse(JSON.stringify(properties)) : {},
    authorsIds: version.authorsIds || []
  } as Page
}
