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

    nuxt.options.appConfig.rimelightComponents = defu(
        nuxt.options.appConfig.rimelightComponents || {},
        options
    )

    nuxt.options.alias['#rimelight-components'] = resolve('./runtime')

    addComponentsDir({
      path: resolve("./runtime/components/"),
      pathPrefix: false,
      //TODO Figure out if this can be typed better
      prefix: options.prefix ?? undefined,
      global: true
    })

    addImportsDir(resolve("./runtime/composables"))
    addImportsDir(resolve("./runtime/utils"))

    // --- Renderer Mapping ---
    const rendererPath = resolve("./runtime/components/blocks/renderer")
    const blockRendererFiles = readdirSync(rendererPath).filter(f => f.endsWith(".vue"))
    const blockRendererNames = blockRendererFiles.map(f => basename(f, ".vue").replace(/Renderer$/, ''))

    const blockRendererTemplate = addBlockMapTemplates(blockRendererNames, resolve)
    nuxt.options.alias["#rimelight-internal/block-renderer-map"] = blockRendererTemplate.dst

    // --- Editor Mapping ---
    const editorPath = resolve("./runtime/components/blocks/editor")
    const blockEditorFiles = readdirSync(editorPath).filter(f => f.endsWith(".vue"))
    const blockEditorNames = blockEditorFiles.map(f => basename(f, ".vue").replace(/Editor$/, ''))

    const blockEditorTemplate = addEditorBlockMapTemplates(blockEditorNames, resolve)
    nuxt.options.alias["#rimelight-internal/block-editor-map"] = blockEditorTemplate.dst
  }
})