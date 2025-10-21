export default defineAppConfig({
  title: "Rimelight Components",
  description: "A Nuxt module.",
  cdn: "https://cdn.rimelight.com",
  logomark: "first-party:logomark-white",
  logotype: "first-party:logotype-white",
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
