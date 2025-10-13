export default defineNuxtConfig({
  rimelightComponents: {},
  compatibilityDate: "2025-12-10",
  devtools: { enabled: true },
  devServer: {
    host: "127.0.0.1",
    port: 3000
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  modules: ['@nuxt/ui', '../src/module'],
  css: ["~/assets/css/main.css"],
  icon: {
    provider: "server",
    class: "icon",
    size: "24px",
    mode: "svg",
    customCollections: [
      {
        prefix: "first-party",
        dir: "./app/assets/icons/first-party",
        normalizeIconName: false
      }
    ]
  },
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
