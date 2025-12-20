import { addTemplate } from "@nuxt/kit"

export function addBlockMapTemplates(blockNames: string[]) {
  const template = addTemplate({
    filename: "rimelight-block-renderer-map.mjs",
    getContents: () => {
      let content = "export const BLOCK_RENDERER_COMPONENT_MAP = {\n"
      blockNames.forEach((name) => {
        const fullComponentName = `${name}Renderer`
        // Using the package name prefix ensures the path is resolveable globally
        const componentPath = `rimelight-components/runtime/components/blocks/renderer/${fullComponentName}.vue`
        content += `  '${name}': () => import('${componentPath}'),\n`
      })
      content += "}\n"
      return content
    },
    write: true
  })

  addTemplate({
    filename: "rimelight-block-renderer-map.d.ts",
    getContents: () => {
      const importerType = '() => Promise<{ default: import("vue").Component }>'
      return `import { Component } from 'vue'\nexport declare const BLOCK_RENDERER_COMPONENT_MAP: Record<string, ${importerType}>`
    },
    write: true
  })

  return template
}

export function addEditorBlockMapTemplates(blockNames: string[]) {
  const template = addTemplate({
    filename: "rimelight-block-editor-map.mjs",
    getContents: () => {
      let content = "export const BLOCK_EDITOR_COMPONENT_MAP = {\n"
      blockNames.forEach((name) => {
        const fullComponentName = `${name}Editor`
        const componentPath = `rimelight-components/runtime/components/blocks/editor/${fullComponentName}.vue`
        content += `  '${name}': () => import('${componentPath}'),\n`
      })
      content += "}\n"
      return content
    },
    write: true
  })

  addTemplate({
    filename: "rimelight-block-editor-map.d.ts",
    getContents: () => {
      const importerType = '() => Promise<{ default: import("vue").Component }>'
      return `import { Component } from 'vue'\nexport declare const BLOCK_EDITOR_COMPONENT_MAP: Record<string, ${importerType}>`
    },
    write: true
  })

  return template
}