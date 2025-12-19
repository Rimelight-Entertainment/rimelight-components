import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    hooks: {
        'mkdist:entry:options'(ctx, entry, options) {
            options.addRelativeDeclarationExtensions = false
        }
    },
    declaration: true,
    clean: true,
    rollup: {
        emitCJS: false,
        inlineDependencies: true
    },
})