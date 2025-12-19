import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    failOnWarn: false,
    hooks: {
        'mkdist:entry:options'(ctx, entry, options) {
            options.addRelativeDeclarationExtensions = false
        }
    },
})