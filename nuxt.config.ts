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
    // Dev Modules
    "@nuxt/a11y",
    "@nuxt/test-utils",
    "@nuxtjs/html-validator",
    // Must go before Content
    "@nuxtjs/i18n",
    "@nuxt/image",
    // SEO Modules
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "nuxt-og-image",
    // Must go before UI
    "@nuxt/content",
    // Must go after Content
    "@nuxt/ui",
    "nuxt-studio",
    "@nuxtjs/device",
    "nuxt-llms",
    "@nuxt/scripts",
    "nuxt-security",
    "@pinia/nuxt",
    "@pinia/colada-nuxt",
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
    },
    nitro: {
      experimental: {
        websocket: true,
        tasks: true
      },
      compressPublicAssets: true,
      minify: true,
      preset: "cloudflare-module",
      cloudflare: {
        deployConfig: true,
        nodeCompat: true
      },
      prerender: {
        routes: ["/"],
        crawlLinks: true
      },
      routeRules: {
        // ISR Rules
        "/api/**": { isr: 60 }
      }
    },
    site: {
      url: "https://rimelight-components.com",
      indexable: true,
      trailingSlash: false
    },
    robots: {
      blockAiBots: true,
      blockNonSeoBots: true,
      disallow: ["/dashboard"]
    },
    a11y: {
      enabled: false
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

  htmlValidator: {
    options: {
      rules: { "meta-refresh": "off" }
    },
    failOnError: false
  },

  security: {
    strict: false,
    headers: {
      contentSecurityPolicy: {
        "default-src": ["'none'"],
        "base-uri": ["'none'"],
        "font-src": ["'self'", "https:", "data:", "https://fonts.gstatic.com"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'self'"],
        "img-src": [
          "'self'",
          "data:",
          "https://cdn.rimelight-components.com",
          "https://cdn.rimelight.com",
          "https://placehold.co",
          "https://avatars.githubusercontent.com",
          "https://i.ytimg.com",
          "https://*.youtube.com"
        ],
        "object-src": ["'none'"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"],
        "script-src": [
          "'self'",
          "https:",
          "'unsafe-inline'",
          "https://esm.sh",
          "https://static.cloudflareinsights.com",
          "https://www.youtube.com",
          "https://s.ytimg.com",
          "'wasm-unsafe-eval'",
          "'unsafe-eval'",
          "'strict-dynamic'",
          "'nonce-{{nonce}}'"
        ],
        "frame-src": ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com"],
        "connect-src": [
          "'self'",
          "https://danielmarchi.dev",
          "https://api.iconify.design",
          "https://api.unisvg.com",
          "https://api.simplesvg.com",
          "https://cloudflareinsights.com",
          "https://static.cloudflareinsights.com",
          "https://nuxt.studio",
          "https://*.nuxt.com",
          "https://*.nuxt.dev",
          "https://api.github.com",
          "https://raw.githubusercontent.com",
          "https://esm.sh",
          "https://*.youtube.com"
        ]
      },
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubdomains: true,
        preload: true
      },
      crossOriginOpenerPolicy: "same-origin",
      crossOriginEmbedderPolicy: "unsafe-none",
      referrerPolicy: "strict-origin-when-cross-origin",
      xFrameOptions: "SAMEORIGIN",
      xContentTypeOptions: "nosniff"
    },
    nonce: true,
    ssg: {
      meta: true,
      hashScripts: true,
      hashStyles: false,
      nitroHeaders: true,
      exportToPresets: false
    },
    sri: true
  },

  router: {
    options: {
      scrollBehaviorType: "smooth"
    }
  },

  routeRules: {
    // Disable rate limiting for internal Nuxt endpoints
    "/__nuxt_content/**": { security: { rateLimiter: false } },
    "/_content/**": { security: { rateLimiter: false } },
    "/api/_content/**": { security: { rateLimiter: false } },
    "/__nuxt_studio/**": { security: { rateLimiter: false } },
    "/__nuxt_hints/**": { security: { enabled: false } },
    "/_nuxt/**": { security: { rateLimiter: false } }
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

  sitemap: {
    zeroRuntime: true
  },

  content: {
    build: {
      markdown: {
        toc: {
          depth: 3
        }
      }
    }
  },

  studio: {
    i18n: {
      defaultLocale: "en"
    },
    route: "/studio",
    repository: {
      provider: "github",
      owner: "Rimelight-Entertainment",
      repo: "rimelight-components"
    }
  },

  llms: {
    domain: "https://rimelight-components.com",
    title: "Rimelight Components",
    description: "A component library."
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
