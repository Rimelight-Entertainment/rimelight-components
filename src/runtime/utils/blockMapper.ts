import { defineAsyncComponent, type Component } from "vue"
import { type BlockType } from "../types"

import { BLOCK_RENDERER_COMPONENT_MAP } from "#rimelight-components/rimelight-block-renderer-map"
import { BLOCK_EDITOR_COMPONENT_MAP } from "#rimelight-components/rimelight-block-editor-map"

type ComponentImporter = () => Promise<{ default: Component }>


/**
 * Maps the block type string from the database to a dynamically imported Vue component.
 *
 * @param type The BlockType string from the content JSON (e.g., 'ParagraphBlock').
 * @returns A lazily loaded Vue component reference, or undefined if not found.
 */
export const getBlockRendererComponent = (
    type: BlockType | string
): Component | undefined => {
  const componentImporter = BLOCK_RENDERER_COMPONENT_MAP[type] as
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

/**
 * Maps the block type string from the database to a dynamically imported Vue component
 * specifically for the editor view.
 *
 * @param type The BlockType string from the content JSON.
 * @returns A lazily loaded Vue component reference, or undefined if not found.
 */
export const getBlockEditorComponent = (
    type: BlockType | string
): Component | undefined => {
  const componentImporter = BLOCK_EDITOR_COMPONENT_MAP[type] as
      | ComponentImporter
      | undefined

  if (!componentImporter) {
    console.warn(
        `[EditorBlockMapper] Editor block component not found for type: ${type}. Please check block name.`
    )
    return undefined
  }

  // Use defineAsyncComponent for efficient, lazy loading
  return defineAsyncComponent(async () => {
    const module = await componentImporter()
    return module.default
  })
}