import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
  extends: [["..", { install: true }]],

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      title: "Rimelight Components",
      titleTemplate: "%s | Rimelight Components",
      meta: [
        { name: "description", content: "A component library." },
        { name: "author", content: "Rimelight Entertainment" },
        { name: "creator", content: "Rimelight Entertainment" }
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }]
    }
  },

  icon: {
    customCollections: [
      {
        prefix: "first-party",
        dir: "./app/assets/icons/first-party",
        normalizeIconName: false
      },
      {
        prefix: "logos",
        dir: "./app/assets/icons/first-party/logos",
        normalizeIconName: false
      }
    ]
  },

  image: {
    domains: ["rimelight-components.com"],
    cloudflare: {
      baseURL: "https://cdn.rimelight-components.com"
    }
  },

  studio: {
    repository: {
      provider: "github",
      owner: "Rimelight-Entertainment",
      repo: "rimelight-components"
    }
  },

  fonts: {
    families: [
      {
        name: "JetBrains Mono",
        global: true,
        provider: "local",
        preload: true
      },
      {
        name: "Noto Sans",
        provider: "google",
        preload: true,
        global: true
      }
    ]
  },

  llms: {
    domain: "https://rimelight-components.com",
    title: "Rimelight Components",
    description: "A component library."
  },

  $production: {
    site: {
      url: "https://rimelight-components.com"
    }
  }
})
