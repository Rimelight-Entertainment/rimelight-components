import { type MaybeRefOrGetter, toValue } from "vue"
import { type Localized, type Page, type PageDefinition, type PageVersion, type Property } from "#rimelight-components/types"

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
 * Ensures a page strictly adheres to its PageDefinition.
 * - Adds missing properties and groups in the correct order.
 * - Removes properties and groups no longer in the definition.
 * - Handles mapping of flat values from the DB into the hydrated schema.
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

    const definitionFields = definitionGroup.fields || {}

    for (const [fieldId, definitionField] of Object.entries(definitionFields)) {
      let value = definitionField.defaultValue

      if (existingGroup) {
        // 1. Check if it's already hydrated: group.fields[fieldId].defaultValue
        if (existingGroup.fields && existingGroup.fields[fieldId] && existingGroup.fields[fieldId].defaultValue !== undefined) {
          value = existingGroup.fields[fieldId].defaultValue
        }
        // 2. Check if it's flat in a group: group[fieldId]
        else if (existingGroup[fieldId] !== undefined) {
          value = existingGroup[fieldId]
        }
        // 3. Fallback: check if it's totally flat (no group nesting in DB) - optional based on preference
        // else if (existingProperties[fieldId] !== undefined) { value = existingProperties[fieldId] }
      }

      updatedGroupFields[fieldId] = {
        ...JSON.parse(JSON.stringify(definitionField)),
        defaultValue: value
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

  page.properties = updatedProperties

  // 2. Sync Blocks (Remaining code unchanged...)
  if (definition.initialBlocks) {
    const idealBlocks = definition.initialBlocks()
    const currentBlocks = [...page.blocks]
    const idealBlocksMap = new Map(idealBlocks.map((b) => [b.id, b]))

    const filteredCurrent = currentBlocks.filter((b) => {
      if (!b.isTemplated) return true
      return idealBlocksMap.has(b.id)
    })

    if (filteredCurrent.length !== currentBlocks.length) {
      hasChanged = true
    }

    let lastExistingIdealIndex = -1
    for (const idealBlock of idealBlocks) {
      const existingIndex = filteredCurrent.findIndex((b) => b.id === idealBlock.id)
      if (existingIndex !== -1) {
        lastExistingIdealIndex = existingIndex
      } else {
        filteredCurrent.splice(lastExistingIdealIndex + 1, 0, JSON.parse(JSON.stringify(idealBlock)))
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
 * Strips away the schema (labels, types, etc.) from properties, returning only the values.
 * Useful for saving to the database.
 */
export function dehydratePageProperties(properties: any): Record<string, any> {
  const dehydrated: Record<string, any> = {}

  for (const [groupId, group] of Object.entries(properties)) {
    // If it's a hydrated group with a 'fields' object
    if (group && typeof group === 'object' && 'fields' in (group as any)) {
      const groupValues: Record<string, any> = {}
      const fields = (group as any).fields

      for (const [fieldId, field] of Object.entries(fields)) {
        groupValues[fieldId] = (field as any).defaultValue
      }
      dehydrated[groupId] = groupValues
    } else {
      // It's already flat or unknown, keep as is
      dehydrated[groupId] = group
    }
  }

  return dehydrated
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
    authorsIds: (version as any).authorsIds || (version as any).authorIds || [],
    createdAt: version.createdAt ? new Date(version.createdAt) : new Date(),
    updatedAt: version.updatedAt ? new Date(version.updatedAt) : new Date(),
    postedAt: version.postedAt ? new Date(version.postedAt) : null,
    banner: version.banner,
    icon: version.icon,
    images: version.images || [],
    title: version.title || { en: "" },
    slug: version.slug || "",
    description: version.description || { en: "" },
    tags: version.tags || [],
    links: version.links || []
  } as Page
}
