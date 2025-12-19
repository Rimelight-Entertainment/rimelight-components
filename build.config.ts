import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: [
        './src/module',
        {
            builder: 'mkdist',
            input: './src/runtime',
            outDir: './dist/runtime',
            format: 'esm',
            declaration: true
        }
    ]
})