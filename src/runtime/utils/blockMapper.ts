// src/runtime/utils/blockMapper.ts

import { defineAsyncComponent, type Component } from "vue"
import { type BlockType } from "../types/blocks"

// 💡 NEW: Import the automatically generated component map.
// This alias is defined in module.ts and points to the generated file in .nuxt/
import { BLOCK_COMPONENT_MAP } from "#build/rimelight-blocks-map"

type ComponentImporter = () => Promise<{ default: Component }>

// We no longer need typeToRelativePath or the global BLOCK_COMPONENTS constant.

/**
 * Maps the block type string from the database to a dynamically imported Vue component.
 *
 * @param type The BlockType string from the content JSON (e.g., 'ParagraphBlock').
 * @returns A lazily loaded Vue component reference, or undefined if not found.
 */
export const getBlockComponent = (
  type: BlockType | string
): Component | undefined => {
  const componentImporter = BLOCK_COMPONENT_MAP[type] as
    | ComponentImporter
    | undefined

  if (!componentImporter) {
    console.warn(
      `[BlockMapper] Block component not found for type: ${type}. Please check block name.`
    )
    return undefined
  }

  return defineAsyncComponent(async () => {
    const module = await componentImporter()
    return module.default
  })
}
