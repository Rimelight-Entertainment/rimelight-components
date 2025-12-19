import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: [
        './src/module',
        { input: './src/runtime/composables/index', outDir: './dist/composables', name: 'index' },
        { input: './src/runtime/utils/index', outDir: './dist/utils', name: 'index' },
        { input: './src/runtime/locale/index', outDir: './dist/locale', name: 'index' },
    ],
    declaration: true,
    externals: [
        'nuxt',
        '@nuxt/schema',
        '@nuxt/kit',
        '@nuxt/ui',
        'vue',
        'defu',
        'tailwind-variants'
    ]
})