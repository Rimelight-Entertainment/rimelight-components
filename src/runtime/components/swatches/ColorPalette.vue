<script setup lang="ts">
import { computed } from "vue"
import ColorSwatch from "./ColorSwatch.vue"
import { tv } from "../../internal/tv"
import { useRC } from "../../composables"

export interface ColorPaletteProps {
  /**
   * Raw CSS content to parse
   */
  css?: string
  /**
   * UI custom classes
   */
  rc?: {
    root?: string
    section?: string
    title?: string
    grid?: string
    swatch?: string
  }
}

const { css = "", rc: rcProp } = defineProps<ColorPaletteProps>()

const { rc } = useRC("ColorPalette", rcProp)

const paletteStyles = tv({
  slots: {
    root: "flex flex-col gap-12",
    section: "flex flex-col gap-6",
    title: "",
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
  }
})

const { root, section: sectionStyle, title: titleStyle, grid } = paletteStyles()

interface SwatchData {
  name: string
  value: string
  format: "hex" | "rgb" | "hsl" | "oklch" | "cmyk" | "unknown"
}

interface PaletteSection {
  title: string
  swatches: SwatchData[]
}

const sections = computed(() => {
  if (!css) return []

  const result: PaletteSection[] = []
  const lines = css.split("\n")
  const stack: string[] = []

  function getFormat(value: string): SwatchData["format"] {
    if (value.startsWith("#")) return "hex"
    if (value.startsWith("oklch")) return "oklch"
    if (value.startsWith("rgb")) return "rgb"
    if (value.startsWith("hsl")) return "hsl"
    if (value.startsWith("cmyk")) return "cmyk"
    return "unknown"
  }

  function getName(fullVarName: string): string {
    const parts = fullVarName.split("-")
    return parts[parts.length - 1] ?? ""
  }

  lines.forEach((line) => {
    // Check for region markers
    const regionStartMatch = line.match(/\/\*\s*region\s+(.*?)\s*\*\//)
    const regionEndMatch = line.match(/\/\*\s*endregion\s*\*\//)

    if (regionStartMatch) {
      stack.push(regionStartMatch[1] ?? "")
    }

    // Capture colors only if NOT a comment line (except for the regions we just identified)
    const colorMatch = line.match(/^\s*--color-([\w-]+):\s*(.*?);/)
    if (colorMatch && !line.trim().startsWith("/*")) {
      const fullVarName = colorMatch[1] ?? ""
      const value = colorMatch[2]?.trim() ?? ""
      const title = stack.length > 0 ? stack.join(" › ") : "Other"

      let section = result.find((s) => s.title === title)
      if (!section) {
        section = { title, swatches: [] }
        result.push(section)
      }

      section.swatches.push({
        name: getName(fullVarName),
        value,
        format: getFormat(value)
      })
    }

    if (regionEndMatch) {
      stack.pop()
    }
  })

  return result
})

function getSwatchProps(swatch: SwatchData) {
  const p: any = { name: swatch.name }
  if (swatch.format !== "unknown") {
    p[swatch.format] = swatch.value
  } else {
    p.oklch = swatch.value
  }
  return p
}
</script>

<template>
  <div :class="root({ class: rc.root })">
    <section
      v-for="section in sections"
      :key="section.title"
      :class="sectionStyle({ class: rc.section })"
    >
      <h2 :class="titleStyle({ class: ['text-3xl font-bold text-highlighted', rc.title] })">
        {{ section.title }}
      </h2>
      <div :class="grid({ class: rc.grid })">
        <ColorSwatch
          v-for="swatch in section.swatches"
          :key="swatch.name"
          v-bind="getSwatchProps(swatch)"
          :class="rc.swatch"
        />
      </div>
    </section>
  </div>
</template>
