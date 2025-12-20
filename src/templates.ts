import { addTemplate } from "@nuxt/kit"

export function addBlockMapTemplates(blockNames: string[], resolve: (path: string) => string) {
  return addTemplate({
    filename: "rimelight-block-renderer-map.mjs",
    getContents: () => {
      let content = "export const BLOCK_RENDERER_COMPONENT_MAP = {\n"
      blockNames.forEach((name) => {
        const path = resolve(`./runtime/components/blocks/renderer/${name}Renderer.vue`)
        content += `  '${name}': () => import('${path}'),\n`
      })
      content += "}\n"
      return content
    },
    write: true
  })
}

export function addEditorBlockMapTemplates(blockNames: string[], resolve: (path: string) => string) {
  return addTemplate({
    filename: "rimelight-block-editor-map.mjs",
    getContents: () => {
      let content = "export const BLOCK_EDITOR_COMPONENT_MAP = {\n"
      blockNames.forEach((name) => {
        const path = resolve(`./runtime/components/blocks/editor/${name}Editor.vue`)
        content += `  '${name}': () => import('${path}'),\n`
      })
      content += "}\n"
      return content
    },
    write: true
  })
}