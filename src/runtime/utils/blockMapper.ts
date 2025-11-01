import { defineAsyncComponent, type Component } from "vue"
import { type BlockType } from "../types/blocks"

type ComponentModule = {
  default: Component
}

const BLOCK_COMPONENTS = import.meta.glob<ComponentModule>(
  "../components/blocks/*.vue"
)

/**
 * Converts a database BlockType string (e.g., 'ParagraphBlock') into a path
 * relative to the components/blocks directory (e.g., '/components/blocks/ParagraphBlock.vue').
 * @param type The BlockType string from the content JSON.
 * @returns The relative file path string.
 */
const typeToRelativePath = (type: BlockType | string): string => {
  return `/components/blocks/${type}.vue`
}

/**
 * Maps the block type string from the database to a dynamically imported Vue component.
 *
 * @param type The BlockType string from the content JSON (e.g., 'ParagraphBlock').
 * @returns A lazily loaded Vue component reference, or undefined if not found.
 */
export const getBlockComponent = (
  type: BlockType | string
): Component | undefined => {
  const componentPath = typeToRelativePath(type)

  const componentImporter = BLOCK_COMPONENTS[componentPath]

  if (!componentImporter) {
    console.warn(
      `[BlockMapper] Block component not found for type: ${type}. Expected path: ${componentPath}`
    )
    return undefined
  }

  return defineAsyncComponent(async () => {
    const module = await componentImporter()
    return module.default
  })
}
