import { defineAsyncComponent, type Component } from "vue"
import { type BlockType } from "../types"

// Use the new aliases defined in the module setup
// @ts-ignore - these are virtual files generated at build time
import { BLOCK_RENDERER_COMPONENT_MAP } from "#rimelight-block-renderer-map"
// @ts-ignore
import { BLOCK_EDITOR_COMPONENT_MAP } from "#rimelight-block-editor-map"

type ComponentImporter = () => Promise<{ default: Component }>

export const getBlockRendererComponent = (
    type: BlockType | string
): Component | undefined => {
  const componentImporter = BLOCK_RENDERER_COMPONENT_MAP[type] as
      | ComponentImporter
      | undefined

  if (!componentImporter) {
    console.warn(
        `[BlockMapper] Block component not found for type: ${type}.`
    )
    return undefined
  }

  return defineAsyncComponent(async () => {
    const module = await componentImporter()
    return module.default
  })
}

export const getBlockEditorComponent = (
    type: BlockType | string
): Component | undefined => {
  // Guard for Server Side Rendering
  // The editor should typically only initialize on the client
  if (import.meta.server) return undefined

  const componentImporter = BLOCK_EDITOR_COMPONENT_MAP[type] as
      | ComponentImporter
      | undefined

  if (!componentImporter) {
    console.warn(
        `[EditorBlockMapper] Editor block component not found for type: ${type}.`
    )
    return undefined
  }

  return defineAsyncComponent(async () => {
    const module = await componentImporter()
    return module.default
  })
}