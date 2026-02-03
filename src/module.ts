import { defineNuxtModule, addComponentsDir, createResolver } from "@nuxt/kit"
import { name, version, homepage } from "../package.json"
import { type CalloutOptions, defaultOptions } from "./defaults"
import { defu } from "defu"
import { addBlockMapTemplates, addEditorBlockMapTemplates } from "./templates"
import { readdirSync } from "node:fs"
import { basename } from "node:path"

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
      nuxt: ">=4.1.0"
    }
  },
  defaults: defaultOptions,
  hooks: {},
  moduleDependencies(_nuxt) {
    const dependencies: Record<string, any> = {
      "@nuxt/image": {
        version: ">=2.0.0",
        optional: false,
        overrides: {},
        defaults: {}
      },
      "@nuxtjs/i18n": {
        version: ">=10.2.1",
        optional: false,
        overrides: {},
        defaults: {
          defaultLocale: "en"
        }
      },
      "@nuxt/ui": {
        version: ">=4.2.1",
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
      }
    }
    return dependencies
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.appConfig.rimelightComponents = defu(
      nuxt.options.appConfig.rimelightComponents || {},
      options
    )

    nuxt.options.alias["rimelight-components/components"] = resolve("./runtime/components")
    nuxt.options.alias["rimelight-components/composables"] = resolve("./runtime/composables")
    nuxt.options.alias["rimelight-components/types"] = resolve("./runtime/types")
    nuxt.options.alias["rimelight-components/utils"] = resolve("./runtime/utils")
    nuxt.options.alias["rimelight-components/auth"] = resolve("./runtime/auth")
    nuxt.options.alias["rimelight-components/db"] = resolve("./runtime/db")

    addComponentsDir({
      path: resolve("./runtime/components/"),
      pathPrefix: false,
      //TODO Figure out if this can be typed better
      prefix: options.prefix ?? undefined,
      global: true,
      ignore: ["**/index.*"]
    })

    // Scan the directory for all .vue files
    const blockRendererFiles = readdirSync(resolve("./runtime/components/blocks/renderer")).filter(
      (name) => name.endsWith(".vue")
    )

    // Generate a clean list of component names
    const blockRendererNames = blockRendererFiles.map((file) => {
      const baseName = basename(file, ".vue") // e.g., 'SectionBlockRenderer'
      return baseName.replace(/Renderer$/, "") // e.g., 'SectionBlock'
    })

    // Generate the Component Map Template
    const blockRendererTemplate = addBlockMapTemplates(blockRendererNames)

    // Expose the map template to the runtime via an alias
    nuxt.options.alias["#build/rimelight-block-renderer-map"] = blockRendererTemplate.dst

    const blockEditorFiles = readdirSync(resolve("./runtime/components/blocks/editor")).filter(
      (name) => name.endsWith(".vue")
    )

    // Generate a clean list of component names
    const blockEditorNames = blockEditorFiles.map((file) => {
      const baseName = basename(file, ".vue") // e.g., 'SectionBlockEditor'
      return baseName.replace(/Editor$/, "") // e.g., 'SectionBlock'
    })

    // Generate the Component Map Template
    const blockEditorTemplate = addEditorBlockMapTemplates(blockEditorNames)

    // Expose the map template to the runtime via an alias
    nuxt.options.alias["#build/rimelight-block-editor-map"] = blockEditorTemplate.dst

    // Register type definitions
    nuxt.hook("prepare:types", ({ references }) => {
      references.push({ path: resolve("./runtime/app.config.d.ts") })
    })
  }
})
