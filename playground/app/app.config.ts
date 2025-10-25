export default defineAppConfig({
  title: "Rimelight Components",
  description: "A Nuxt module.",
  cdn: "https://cdn.rimelight.com",
  logomark: "first-party:logomark-white",
  logotype: "first-party:logotype-white",
  rimelightComponents: {
    callouts: {
      info: {
        icon: "lucide:shield-alert",
        title: "callout_info_title",
        description: "callout_info_description"
      },
      success: {
        icon: "lucide:circle-alert",
        title: "callout_success_title",
        description: "callout_success_description"
      },
      warning: {
        icon: "lucide:triangle-alert",
        title: "callout_warning_title",
        description: "callout_warning_description"
      },
      error: {
        icon: "lucide:octagon-alert",
        title: "callout_error_title",
        description: "callout_error_description"
      },
      commentary: {
        icon: "lucide:message-circle-warning",
        title: "callout_commentary_title",
        description: "callout_commentary_description"
      },
      ideation: {
        icon: "lucide:badge-alert",
        title: "callout_ideation_title",
        description: "callout_ideation_description"
      },
      source: {
        icon: "lucide:book-alert",
        title: "callout_source_title",
        description: "callout_source_description"
      }
    }
  },
  ui: {
    colors: {
      neutral: "neutral",
      primary: "blue",
      info: "info",
      success: "success",
      warning: "warning",
      error: "error",
      commentary: "commentary",
      ideation: "ideation",
      source: "source"
    },
    navigationMenu: {
      variants: {
        orientation: {
          horizontal: {
            content: "w-screen"
          }
        }
      }
    }
  }
})
