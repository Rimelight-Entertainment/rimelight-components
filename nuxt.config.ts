// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/image", "@nuxt/ui"],
  ui: {
    prefix: "U",
    theme: {
      colors: [
        "neutral",
        "primary",
        "secondary",
        "tertiary",
        "info",
        "success",
        "warning",
        "error",
        "commentary",
        "ideation",
        "creator",
        "source"
      ]
    }
  }
})