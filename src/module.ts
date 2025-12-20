import {
  defineNuxtModule,
  addComponentsDir,
  addImportsDir,
  createResolver
} from "@nuxt/kit"
import { name, version, homepage } from "../package.json"
import { type CalloutOptions, defaultOptions } from "./defaults"
import { defu } from "defu"

import { addBlockMapTemplates, addEditorBlockMapTemplates } from "./templates"

import { readdirSync } from "node:fs"
import { basename } from "node:path"
import type { Nuxt } from "@nuxt/schema"

export type * from "./runtime/types"

export interface ModuleOptions {
  /**
   * Prefix for components
   * @defaultValue `RC`
   */
  prefix?: string
  callouts: {
    info: CalloutOptions
    success: CalloutOptions
    warning: CalloutOptions
    error: CalloutOptions
    commentary: CalloutOptions
    ideation: CalloutOptions
    source: CalloutOptions
  }
}

//TODO Populate the schema: {} field
export default defineNuxtModule<ModuleOptions>().with({
  meta: {
    name,
    version,
    docs: homepage,
    configKey: "rimelightComponents",
    compatibility: {
      nuxt: ">=4.0.0"
    }
  },
  defaults: defaultOptions,
  hooks: {},
  moduleDependencies(_nuxt) {
    const dependencies: Record<string, any> = {
      "@nuxt/image": {
        version: ">=1.0.0",
        optional: false,
        overrides: {},
        defaults: {}
      },
      "@nuxtjs/i18n": {
        version: ">=10.1.1",
        optional: false,
        overrides: {},
        defaults: {}
      },
      "@nuxt/ui": {
        version: ">=4.0.0",
        optional: false,
        overrides: {},
        defaults: {
          prefix: "U",
          theme: {
            colors: [
              "neutral",
              "primary",
              "secondary",
              "info",
              "success",
              "warning",
              "error",
              "commentary",
              "ideation",
              "source"
            ]
          }
        }
      },
      "@vueuse/nuxt": {
        version: ">=13.9.0",
        optional: false,
        overrides: {},
        defaults: {}
      },
      "motion-v/nuxt": {
        version: ">=1.7.2",
        optional: false,
        overrides: {},
        defaults: {}
      }
    }
    return dependencies
  },
  onInstall(_nuxt: Nuxt) {
    console.log(`Setting up ${name}.`)
  },
  onUpgrade(_nuxt: Nuxt, _options: ModuleOptions, previousVersion: string) {
    console.log(`Upgrading ${name} from ${previousVersion} to ${version}.`)
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimePath = resolve("./runtime")

    // 1. Sync AppConfig
    nuxt.options.appConfig.rimelightComponents = defu(
        nuxt.options.appConfig.rimelightComponents || {},
        options
    )

    // 2. CRITICAL: Transpilation
    // This ensures .vue files are compiled to JS so Nitro doesn't see <script> tags
    nuxt.options.build.transpile.push(runtimePath)
    nuxt.options.build.transpile.push("rimelight-components")

    // 3. Aliases
    nuxt.options.alias['#rimelight-components'] = runtimePath

    // 4. Registration
    addComponentsDir({
      path: resolve("./runtime/components/"),
      pathPrefix: false,
      prefix: options.prefix ?? undefined,
      global: true
    })
    addImportsDir(resolve("./runtime/composables"))
    addImportsDir(resolve("./runtime/utils"))

    // 5. Template Logic
    const getBlockNames = (dir: string, suffix: string) =>
        readdirSync(resolve(dir))
            .filter(f => f.endsWith(".vue"))
            .map(f => basename(f, ".vue").replace(new RegExp(`${suffix}$`), ''))

    const rendererNames = getBlockNames("./runtime/components/blocks/renderer", "Renderer")
    const editorNames = getBlockNames("./runtime/components/blocks/editor", "Editor")

    const blockRendererTemplate = addBlockMapTemplates(rendererNames)
    const blockEditorTemplate = addEditorBlockMapTemplates(editorNames)

    const rendererAlias = "#rimelight-block-renderer-map"
    const editorAlias = "#rimelight-block-editor-map"

    nuxt.options.alias[rendererAlias] = blockRendererTemplate.dst
    nuxt.options.alias[editorAlias] = blockEditorTemplate.dst

    // 6. Nitro Bridge & Security Hook
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.alias[rendererAlias] = blockRendererTemplate.dst

      // Virtual Guard: Provide an empty map for Editor on the server
      nitroConfig.virtual = nitroConfig.virtual || {}
      nitroConfig.virtual[editorAlias] = 'export const BLOCK_EDITOR_COMPONENT_MAP = {}'

      // Externalize: Prevents Nitro's Rollup from deep-crawling .vue source
      nitroConfig.externals = nitroConfig.externals || {}
      nitroConfig.externals.inline = nitroConfig.externals.inline || []
      nitroConfig.externals.inline.push(runtimePath)
      nitroConfig.externals.inline.push("rimelight-components")
    })

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ path: blockRendererTemplate.dst })
      references.push({ path: blockEditorTemplate.dst })
    })
  }
})
