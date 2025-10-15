import {
  defineNuxtModule,
  addComponentsDir,
  addImportsDir,
  createResolver
} from "@nuxt/kit"

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "rimelight-components",
    version: "0.0.1",
    configKey: "rimelightComponents",
    compatibility: {
      nuxt: ">=4.0.0"
    }
  },
  defaults: {},
  hooks: {},
  moduleDependencies: {
    "@nuxt/image": {
      version: ">=1.0.0",
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
    }
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.css.push(resolver.resolve("./index.css"))

    addComponentsDir({
      path: resolver.resolve("./runtime/components/"),
      pathPrefix: false,
      prefix: "RC",
      global: true
    })

    addImportsDir(resolver.resolve("./runtime/composables"))
  },
  onInstall() {
    console.log("Setting up rimelight-components for the first time!")
  },
  onUpgrade() {
    console.log("Upgrading rimelight-components.")
  }
})
