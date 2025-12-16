export default defineNuxtConfig({
  rimelightComponents: {},
  compatibilityDate: "2025-12-10",
  devtools: { enabled: true },
  devServer: {
    host: "127.0.0.1",
    port: 3000
  },
  vite: {
    server: {
      hmr: {
        overlay: false
      }
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  modules: ["../src/module", "@nuxt/ui"],
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
  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en",
    locales: [
      {
        code: "en",
        name: "English",
        file: "en.json"
      }
    ]
  }
})
