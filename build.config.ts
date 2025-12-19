import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: [
        './src/module',
        {
            input: './src/runtime/composables/index',
            outDir: './dist/runtime/composables',
            name: 'index'
        },
        {
            input: './src/runtime/utils/index',
            outDir: './dist/runtime/utils',
            name: 'index'
        },
        {
            input: './src/runtime/locale/index',
            outDir: './dist/runtime/locale',
            name: 'index'
        }
    ],
    declaration: true,
    rollup: {
        emitCJS: false
    }
})