import {
  defineNuxtModule,
  addComponentsDir,
  addImportsDir,
  createResolver
} from "@nuxt/kit"
import { name, version, homepage } from "../package.json"
import { defaultOptions } from "./defaults"
import { defu } from "defu"

import { addBlockMapTemplates } from "./templates"

import { readdirSync } from "node:fs"
import { basename } from "node:path"

interface CalloutOptions {
  icon: string
  title: string
  tooltip: string
}

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

export default defineNuxtModule<ModuleOptions>({
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
  moduleDependencies: {
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
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.appConfig.rimelightComponents = defu(
      nuxt.options.appConfig.rimelightComponents || {},
      options
    )

    addComponentsDir({
      path: resolver.resolve("./runtime/components/"),
      pathPrefix: false,
      prefix: options.prefix,
      global: true
    })

    addImportsDir(resolver.resolve("./runtime/composables"))
    addImportsDir(resolver.resolve("./runtime/types"))
    addImportsDir(resolver.resolve("./runtime/utils"))

    const blocksPath = resolver.resolve("./runtime/components/blocks")

    // 1. Scan the directory for all .vue files
    const blockFiles = readdirSync(blocksPath).filter((name) =>
      name.endsWith(".vue")
    )

    // Generate a clean list of component names (e.g., ['ParagraphBlock', 'ImageBlock'])
    const blockNames = blockFiles.map((file) => basename(file, ".vue"))

    // --- 2. Generate the Component Map Template using the new function ---
    const template = addBlockMapTemplates(blockNames, resolver)

    // --- 3. Expose the map template to the runtime via an alias ---
    // This allows blockMapper.ts to import the map using '#build/rimelight-blocks-map'
    nuxt.options.alias["#build/rimelight-blocks-map"] = template.dst
  },
  onInstall() {
    console.log("Setting up rimelight-components for the first time!")
  },
  onUpgrade() {
    console.log("Upgrading rimelight-components.")
  }
})
