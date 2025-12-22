import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
    entries: [
        "./src/module",
        { input: "./src/runtime/", outDir: "./dist/runtime", format: "esm" }
    ],
    declaration: true,
    clean: true,
    rollup: {
        emitCJS: false,
    },
    failOnWarn: false
})