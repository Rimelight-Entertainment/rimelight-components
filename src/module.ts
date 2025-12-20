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

    //nuxt.options.build.transpile.push('@nuxt/ui')
    nuxt.options.alias['#rimelight-components'] = resolve('./runtime')
    //nuxt.options.alias['rimelight-components/utils'] = resolve('./runtime/utils/index')

    addComponentsDir({
      path: resolve("./runtime/components/"),
      pathPrefix: false,
      //TODO Figure out if this can be typed better
      prefix: options.prefix ?? undefined,
      global: true
    })

    addImportsDir(resolve("./runtime/composables"))
    addImportsDir(resolve("./runtime/utils"))

    // Scan the directory for all .vue files
    const blockRendererFiles = readdirSync(
        resolve("./runtime/components/blocks/renderer")
    ).filter((name) => name.endsWith(".vue"))

    // Generate a clean list of component names
    const blockRendererNames = blockRendererFiles.map((file) => {
      const baseName = basename(file, ".vue") // e.g., 'SectionBlockRenderer'
      return baseName.replace(/Renderer$/, '') // e.g., 'SectionBlock'
    })

    // Generate the Component Map Template
    const blockRendererTemplate = addBlockMapTemplates(blockRendererNames)

    // Expose the map template to the runtime via an alias
    nuxt.options.alias["#rimelight-internal/rimelight-block-renderer-map"] = blockRendererTemplate.dst

    const blockEditorFiles = readdirSync(
        resolve("./runtime/components/blocks/editor")
    ).filter((name) => name.endsWith(".vue"))

    // Generate a clean list of component names
    const blockEditorNames = blockEditorFiles.map((file) => {
      const baseName = basename(file, ".vue") // e.g., 'SectionBlockEditor'
      return baseName.replace(/Editor$/, '') // e.g., 'SectionBlock'
    })

    // Generate the Component Map Template
    const blockEditorTemplate = addEditorBlockMapTemplates(blockEditorNames)

    // Expose the map template to the runtime via an alias
    nuxt.options.alias["#rimelight-internal/rimelight-block-editor-map"] = blockEditorTemplate.dst

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.alias["#rimelight-internal/rimelight-block-renderer-map"] = blockRendererTemplate.dst
      nitroConfig.alias["#rimelight-internal/rimelight-block-editor-map"] = blockEditorTemplate.dst
    })
  }
})