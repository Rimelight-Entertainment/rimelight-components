import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2026-02-13",
  devtools: { enabled: true },
  devServer: {
    host: "127.0.0.1",
    port: 3000,
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
  future: {
    compatibilityVersion: 5,
  },
  extends: [".."],
  modules: ["@nuxt/icon"],
  build: {
    transpile: ["@nuxt/ui"],
  },
  css: ["~/assets/css/main.css"],
  icon: {
    class: "icon",
    size: "24px",
    customCollections: [
      {
        prefix: "first-party",
        dir: "./app/assets/icons/first-party",
        normalizeIconName: false,
      },
    ],
  },
  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en",
  },
  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
});
