import {
  defineNuxtModule,
  addComponentsDir,
  addImportsDir,
  createResolver
} from "@nuxt/kit"

interface CalloutOptions {
  icon: string
  title: string
  tooltip: string
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
      title: "Note",
      tooltip: "This callout is used for general notes."
    },
    success: {
      icon: "lucide:circle-alert",
      title: "Tip",
      tooltip: "This callout is used for tips and useful information."
    },
    warning: {
      icon: "lucide:triangle-alert",
      title: "Warning",
      tooltip: "This callout is used for important information."
    },
    error: {
      icon: "lucide:octagon-alert",
      title: "Danger",
      tooltip: "This callout is used for critical information and prohibitions."
    },
    commentary: {
      icon: "lucide:message-circle-warning",
      title: "Commentary",
      tooltip: "This callout is used for developer commentary."
    },
    ideation: {
      icon: "lucide:badge-alert",
      title: "Ideation",
      tooltip: "This alert is used for ideas and brainstorming."
    },
    source: {
      icon: "lucide:book-alert",
      title: "Creator's Remarks",
      tooltip: "This alert is used for direct commentary of the author."
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
