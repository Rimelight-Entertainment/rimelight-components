import {
  defineNuxtModule,
  addComponentsDir,
  addImportsDir,
  createResolver
} from "@nuxt/kit"

interface CalloutOptions {
  icon: string
  title: string
  description: string
}

interface ModuleOptions {
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

const defaultOptions = {
  callouts: {
    info: {
      icon: "lucide:shield-alert",
      title: "",
      description: ""
    },
    success: {
      icon: "lucide:circle-alert",
      title: "",
      description: ""
    },
    warning: {
      icon: "lucide:triangle-alert",
      title: "",
      description: ""
    },
    error: {
      icon: "lucide:octagon-alert",
      title: "",
      description: ""
    },
    commentary: {
      icon: "lucide:message-circle-warning",
      title: "",
      description: ""
    },
    ideation: {
      icon: "lucide:badge-alert",
      title: "",
      description: ""
    },
    source: {
      icon: "lucide:book-alert",
      title: "",
      description: ""
    }
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "rimelight-components",
    version: "0.0.1",
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

    nuxt.options.appConfig.rimelightComponents = options

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
