import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, basename } from 'node:path'
import { readdirSync } from 'node:fs'
import { addBlockMapTemplates, addEditorBlockMapTemplates } from './scripts/templates'
import { defaultOptions } from './scripts/defaults'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
    compatibilityDate: "2026-02-13",
    alias: {
        "#rimelight-components/types": resolve(currentDir, "types"),
        "#rimelight-components/utils": resolve(currentDir, "utils"),
        "rimelight-components/types": resolve(currentDir, "types"),
        "rimelight-components/utils": resolve(currentDir, "utils"),
        "rimelight-components": currentDir
    },
    devtools: { enabled: true },
    devServer: { host: "127.0.0.1", port: 3000 },
    modules: [
        '@nuxt/ui',
        '@nuxt/icon',
        '@nuxt/image',
        '@nuxtjs/i18n',
        '@nuxt/a11y',
        '@vueuse/nuxt',
        '@nuxtjs/device',
        function (options, nuxt) {
            const resolvePath = (path: string) => resolve(currentDir, path)

            // Scan the directory for all .vue files
            const blockRendererPath = resolvePath("./components/blocks/renderer")
            const blockRendererFiles = readdirSync(blockRendererPath).filter(
                (name) => name.endsWith(".vue")
            )

            // Generate a clean list of component names
            const blockRendererNames = blockRendererFiles.map((file) => {
                const baseName = basename(file, ".vue") // e.g., 'SectionBlockRenderer'
                return baseName.replace(/Renderer$/, "") // e.g., 'SectionBlock'
            })

            // Generate the Component Map Template
            const blockRendererTemplate = addBlockMapTemplates(blockRendererNames)

            // Expose the map template to the runtime via an alias
            nuxt.options.alias["#build/rimelight-block-renderer-map"] = blockRendererTemplate.dst

            const blockEditorPath = resolvePath("./components/blocks/editor")
            const blockEditorFiles = readdirSync(blockEditorPath).filter(
                (name) => name.endsWith(".vue")
            )

            // Generate a clean list of component names
            const blockEditorNames = blockEditorFiles.map((file) => {
                const baseName = basename(file, ".vue") // e.g., 'SectionBlockEditor'
                return baseName.replace(/Editor$/, "") // e.g., 'SectionBlock'
            })

            // Generate the Component Map Template
            const blockEditorTemplate = addEditorBlockMapTemplates(blockEditorNames)

            // Expose the map template to the runtime via an alias
            nuxt.options.alias["#build/rimelight-block-editor-map"] = blockEditorTemplate.dst

            // Register type definitions
            nuxt.hook("prepare:types", ({ references }) => {
                references.push({ path: resolvePath("./types/app.config.d.ts") })
            })
        }
    ],
    appConfig: {
        rimelightComponents: defaultOptions
    },
    components: [
        {
            path: 'components',
            pathPrefix: false,
            prefix: 'RC',
            ignore: ['**/index.*']
        }
    ],
    experimental: {
        viteEnvironmentApi: false,
        typescriptPlugin: true,
        nitroAutoImports: true
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
        defaultLocale: "en"
    },
    css: [
        resolve(currentDir, 'assets/css/index.css')
    ],
    future: {
        compatibilityVersion: 5
    }
})
