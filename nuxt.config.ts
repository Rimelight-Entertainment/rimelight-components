import { defineNuxtConfig } from "nuxt/config"
import { fileURLToPath } from "node:url"
import { dirname, resolve, basename } from "node:path"
import { readdirSync } from "node:fs"
import { addBlockMapTemplates, addEditorBlockMapTemplates } from "./scripts/templates"

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  $meta: {
    name: "rimelight-components"
  },

  compatibilityDate: "2026-02-13",
  future: {
    compatibilityVersion: 5
  },

  experimental: {
    viteEnvironmentApi: true,
    typescriptPlugin: true,
    nitroAutoImports: true,
    componentIslands: {
      selectiveClient: true
    },
    viewTransition: true,
    typedPages: true
  },

  modules: [
    // Must go before Content
    "@nuxtjs/i18n",
    "@nuxt/image",
    // SEO Modules
    "nuxt-og-image",
    // Must go before UI
    "@nuxt/content",
    // Must go after Content
    "@nuxt/ui",
    "@nuxt/scripts",
    "@vueuse/nuxt",
    function (options, nuxt) {
      const resolvePath = (path: string) => resolve(currentDir, path)

      // Scan the directory for all .vue files
      const blockRendererPath = resolvePath("./app/components/article/blocks/renderer")
      const blockRendererFiles = readdirSync(blockRendererPath).filter((name) =>
        name.endsWith(".vue")
      )

      // Generate a clean list of component names
      const blockRendererNames = blockRendererFiles.map((file) => {
        const baseName = basename(file, ".vue") // e.g., 'SectionBlockRenderer'
        return baseName.replace(/Renderer$/, "") // e.g., 'SectionBlock'
      })

      // Generate the Component Map Template
      const blockRendererTemplate = addBlockMapTemplates(blockRendererNames, currentDir)

      // Expose the map template to the runtime via an alias
      nuxt.options.alias["#build/rimelight-block-renderer-map"] = blockRendererTemplate.dst

      const blockEditorPath = resolvePath("./app/components/article/blocks/editor")
      const blockEditorFiles = readdirSync(blockEditorPath).filter((name) => name.endsWith(".vue"))

      // Generate a clean list of component names
      const blockEditorNames = blockEditorFiles.map((file) => {
        const baseName = basename(file, ".vue") // e.g., 'SectionBlockEditor'
        return baseName.replace(/Editor$/, "") // e.g., 'SectionBlock'
      })

      // Generate the Component Map Template
      const blockEditorTemplate = addEditorBlockMapTemplates(blockEditorNames, currentDir)

      // Expose the map template to the runtime via an alias
      nuxt.options.alias["#build/rimelight-block-editor-map"] = blockEditorTemplate.dst

      // Register type definitions
      nuxt.hook("prepare:types", ({ references }) => {
        references.push({ path: resolvePath("./app/types/app.config.d.ts") })
      })
    }
  ],

  ignore: ["**/src-tauri/**"],

  $development: {
    devtools: {
      enabled: true
    },
    // Change to true in case the issue gets resolved: https://github.com/fi3ework/vite-plugin-checker/issues/557
    typescript: {
      typeCheck: false,
      tsConfig: {
        compilerOptions: {
          noUnusedLocals: true,
          allowImportingTsExtensions: true
        },
        include: ["../test/unit/server/**/*.ts", "../test/unit/app/**/*.ts"]
      },
      sharedTsConfig: {
        include: ["../test/unit/shared/**/*.ts"]
      },
      nodeTsConfig: {
        compilerOptions: {
          allowImportingTsExtensions: true,
          paths: {
            "#server/*": ["../server/*"],
            "#shared/*": ["../shared/*"]
          }
        },
        include: ["../*.ts", "../test/e2e/**/*.ts"]
      }
    }
  },

  $test: {
    devtools: {
      enabled: true
    },
    debug: {
      hydration: true
    }
  },

  $production: {
    devtools: {
      enabled: false
    },
    typescript: {
      typeCheck: false
    }
  },

  vite: {
    clearScreen: false,
    optimizeDeps: {
      include: ["@vue/devtools-core", "@vue/devtools-kit"]
    }
  },

  ssr: true,

  app: {
    baseURL: "/",
    head: {
      htmlAttrs: { lang: "en-US" },
      title: "Rimelight Components",
      titleTemplate: "%s | Rimelight Components",
      meta: [
        {
          name: "description",
          content: "A component library."
        },
        {
          name: "author",
          content: "Rimelight Entertainment"
        },
        {
          name: "creator",
          content: "Rimelight Entertainment"
        }
      ],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg"
        }
      ]
    },
    viewTransition: true
  },

  router: {
    options: {
      scrollBehaviorType: "smooth"
    }
  },

  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en",
    langDir: "locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      cookieSecure: true,
      alwaysRedirect: false
    },
    locales: [
      {
        code: "en",
        name: "English",
        language: "en-US",
        file: "en.json"
      },
      {
        code: "pt",
        name: "Português",
        language: "pt-BR",
        file: "pt.json"
      }
    ]
  },

  components: [
    {
      path: resolve(currentDir, "app/components"),
      pathPrefix: false,
      prefix: "RC"
    }
  ],

  colorMode: {
    preference: "system",
    fallback: "dark",
    dataValue: "theme"
  },

  icon: {
    mode: "svg",
    class: "icon",
    size: "24px"
  },

  image: {
    format: ["webp"],
    provider: "cloudflare"
  },

  ogImage: {
    zeroRuntime: true
  },

  ui: {
    prefix: "U",
    mdc: true,
    content: true,
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
})
