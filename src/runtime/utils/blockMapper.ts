import { defineAsyncComponent, resolveComponent, h, type Component } from "vue"
import { type BlockType } from "../types"

// Use the new internal alias you set up in module.ts
import { BLOCK_RENDERER_COMPONENT_MAP } from "#rimelight-internal/block-renderer-map"
import { BLOCK_EDITOR_COMPONENT_MAP } from "#rimelight-internal/block-editor-map"

/**
 * Helper to resolve a component name to a lazy-loaded component.
 */
const createLazyComponent = (componentName: string): Component => {
  return defineAsyncComponent(async () => {
    const component = resolveComponent(componentName)
    // If resolveComponent returns a string, it means the component wasn't found
    if (typeof component === "string") {
      throw new Error(`[BlockMapper] Could not resolve component: ${componentName}`)
    }
    return component as Component
  })
}

export const getBlockRendererComponent = (
    type: BlockType | string
): Component | undefined => {
  const componentName = BLOCK_RENDERER_COMPONENT_MAP[type]

  if (!componentName) {
    console.warn(`[BlockMapper] No renderer found for type: ${type}`)
    return undefined
  }

  return createLazyComponent(componentName)
}

export const getBlockEditorComponent = (
    type: BlockType | string
): Component | undefined => {
  const componentName = BLOCK_EDITOR_COMPONENT_MAP[type]

  if (!componentName) {
    console.warn(`[EditorBlockMapper] No editor found for type: ${type}`)
    return undefined
  }

  return createLazyComponent(componentName)
}