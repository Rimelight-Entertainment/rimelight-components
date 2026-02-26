import { defineNuxtConfig } from "nuxt/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve, basename } from "node:path";
import { readdirSync } from "node:fs";
import { addBlockMapTemplates, addEditorBlockMapTemplates } from "./scripts/templates";
import { defaultOptions } from "./scripts/defaults";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2026-02-13",
  future: {
    compatibilityVersion: 5,
  },

  modules: [
    "@nuxt/a11y",
    "@nuxt/ui",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxtjs/device",
    function (options, nuxt) {
      const resolvePath = (path: string) => resolve(currentDir, path);

      // Scan the directory for all .vue files
      const blockRendererPath = resolvePath("./app/components/article/blocks/renderer");
      const blockRendererFiles = readdirSync(blockRendererPath).filter((name) =>
        name.endsWith(".vue"),
      );

      // Generate a clean list of component names
      const blockRendererNames = blockRendererFiles.map((file) => {
        const baseName = basename(file, ".vue"); // e.g., 'SectionBlockRenderer'
        return baseName.replace(/Renderer$/, ""); // e.g., 'SectionBlock'
      });

      // Generate the Component Map Template
      const blockRendererTemplate = addBlockMapTemplates(blockRendererNames);

      // Expose the map template to the runtime via an alias
      nuxt.options.alias["#build/rimelight-block-renderer-map"] = blockRendererTemplate.dst;

      const blockEditorPath = resolvePath("./app/components/article/blocks/editor");
      const blockEditorFiles = readdirSync(blockEditorPath).filter((name) => name.endsWith(".vue"));

      // Generate a clean list of component names
      const blockEditorNames = blockEditorFiles.map((file) => {
        const baseName = basename(file, ".vue"); // e.g., 'SectionBlockEditor'
        return baseName.replace(/Editor$/, ""); // e.g., 'SectionBlock'
      });

      // Generate the Component Map Template
      const blockEditorTemplate = addEditorBlockMapTemplates(blockEditorNames);

      // Expose the map template to the runtime via an alias
      nuxt.options.alias["#build/rimelight-block-editor-map"] = blockEditorTemplate.dst;

      // Register type definitions
      nuxt.hook("prepare:types", ({ references }) => {
        references.push({ path: resolvePath("./app/types/app.config.d.ts") });
      });
    },
  ],

  ignore: ["**/src-tauri/**"],

  $development: {
    devtools: { enabled: true },
    // Change to true in case the issue gets resolved: https://github.com/fi3ework/vite-plugin-checker/issues/557
    typescript: { typeCheck: false },
    a11y: {
      enabled: true,
      defaultHighlight: false,
      logIssues: false,
    },
    site: { indexable: false },
  },

  $test: {
    devtools: { enabled: true },
  },

  $production: {
    devtools: { enabled: false },
    typescript: { typeCheck: false },
    nitro: {
      compressPublicAssets: true,
      minify: true,
    },
    // Switch to true on release
    site: { url: "https://rimelight-components.com", indexable: false },
    robots: {
      blockAiBots: true,
      blockNonSeoBots: true,
      disallow: ["/dashboard"],
    },
    a11y: {
      enabled: false,
    },
  },

  alias: {
    "#rimelight-components/types": resolve(currentDir, "app/types"),
    "#rimelight-components/utils": resolve(currentDir, "app/utils"),
    "rimelight-components/types": resolve(currentDir, "app/types"),
    "rimelight-components/utils": resolve(currentDir, "app/utils"),
    "#rimelight-components/validators": resolve(currentDir, "shared/validators"),
    "rimelight-components/validators": resolve(currentDir, "shared/validators"),
    "#rimelight-components/auth": resolve(currentDir, "shared/auth"),
    "rimelight-components/auth": resolve(currentDir, "shared/auth"),
    "#rimelight-components/db": resolve(currentDir, "shared/db"),
    "rimelight-components/db": resolve(currentDir, "shared/db"),
    "#rimelight-components/composables": resolve(currentDir, "app/composables"),
    "rimelight-components/composables": resolve(currentDir, "app/composables"),
    "rimelight-components": currentDir,
  },
  appConfig: {
    rimelightComponents: defaultOptions,
  },
  experimental: {
    viteEnvironmentApi: false,
    typescriptPlugin: true,
    nitroAutoImports: true,
    componentIslands: {
      selectiveClient: true,
    },
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
        "source",
        "grandTalePrimary",
        "grandTaleSecondary",
      ],
    },
  },
  colorMode: {
    preference: "dark",
    fallback: "dark",
  },
  fonts: {
    defaults: {
      weights: [
        // Thin
        100,
        // ExtraLight
        200,
        // Light
        300,
        // Regular
        400,
        // Medium
        500,
        // SemiBold
        600,
        // Bold
        700,
        // Extra Bold
        800,
      ],
      styles: ["normal", "italic"],
    },
    families: [
      {
        name: "JetBrains Mono",
        global: true,
        provider: "local",
      },
    ],
  },

  i18n: {
    restructureDir: ".",
    strategy: "prefix_except_default",
    defaultLocale: "en",
    langDir: "app/locales",
    locales: [
      {
        code: "en",
        name: "English",
        file: "en.json",
      },
      {
        code: "pt",
        name: "Português",
        file: "pt.json",
      },
    ],
  },

  css: [resolve(currentDir, "app/assets/css/index.css")],

  components: [
    {
      path: resolve(currentDir, "app/components"),
      pathPrefix: false,
      prefix: "RC",
      global: false,
      ignore: ["**/index.*"],
    },
  ],

  pages: {
    pattern: ["**/*.vue", "!**/components/**"],
  },

  image: {
    format: ["webp"],
    provider: "cloudflare",
    cloudflare: {
      baseURL: "https://cdn.rimelight-components.com",
    },
  },

  icon: {
    class: "icon",
    size: "24px",
    customCollections: [
      {
        prefix: "first-party",
        dir: "./app/assets/icons/first-party",
        normalizeIconName: false,
      },
      {
        prefix: "third-party",
        dir: "./app/assets/icons/third-party",
        normalizeIconName: false,
      },
    ],
  },
});
