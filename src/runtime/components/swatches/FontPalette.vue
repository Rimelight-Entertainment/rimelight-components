<script setup lang="ts">
import { computed } from "vue"
import { useRC, useHeaderStack } from "../../composables"
import { tv } from "../../internal/tv"

export interface FontPaletteProps {
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
  }
}

const { css = "", rc: rcProp } = defineProps<FontPaletteProps>()

const { rc } = useRC("FontPalette", rcProp)

const { totalHeight } = useHeaderStack()
const stickyTop = computed(() => `${totalHeight.value + 32}px`)

const paletteStyles = tv({
  slots: {
    root: "w-full",
    section: "flex flex-col gap-12"
  }
})

const { root } = paletteStyles()

interface FontData {
  name: string
  family: string
}

interface ColorData {
  name: string
  value: string
}

const parsedData = computed(() => {
  if (!css) return { fonts: [], colors: [] }

  const fonts: FontData[] = []
  const colors: ColorData[] = []
  const lines = css.split("\n")

  lines.forEach((line) => {
    // Parse Fonts
    const fontMatch = line.match(/^\s*--font-([\w-]+):\s*(.*?);/)
    if (fontMatch && !line.trim().startsWith("/*")) {
      fonts.push({
        name: fontMatch[1] ?? "",
        family: fontMatch[2]?.trim() ?? ""
      })
    }

    // Parse Text Colors (Variables only, excluding sizes)
    const textColorMatch = line.match(/^\s*--text-([\w-]+):\s*(.*?);/)
    if (textColorMatch && !line.trim().startsWith("/*")) {
      const name = textColorMatch[1] ?? ""
      // Filter out size variables
      const isSize = /^(xs|sm|md|lg|xl|\d+xl|hero|base|desc)$/.test(name)
      if (!isSize) {
        colors.push({
          name,
          value: textColorMatch[2]?.trim() ?? ""
        })
      }
    }
  })

  // Deduplicate colors
  const uniqueColors: ColorData[] = []
  colors.forEach((c) => {
    if (!uniqueColors.find((uc) => uc.name === c.name)) {
      uniqueColors.push(c)
    }
  })

  return { fonts, colors: uniqueColors }
})

const sampleText = "The quick brown fox jumps over the lazy dog"
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const alphabetLower = "abcdefghijklmnopqrstuvwxyz"
const numbers = "0123456789"
const symbols = "!@#$%^&*()_+-=[]{};':\",./<>?"

const headingLevels = [
  { tag: "h1", label: "Heading 1" },
  { tag: "h2", label: "Heading 2" },
  { tag: "h3", label: "Heading 3" },
  { tag: "h4", label: "Heading 4" },
  { tag: "h5", label: "Heading 5" },
  { tag: "h6", label: "Heading 6" }
]

const tabItems = computed(() => {
  return parsedData.value.fonts.map((f) => ({
    label: f.name.charAt(0).toUpperCase() + f.name.slice(1),
    font: f,
    slot: "content"
  }))
})

function getFontStyles(family: string) {
  return { fontFamily: family }
}
</script>

<template>
  <div :class="root({ class: rc.root })">
    <UTabs
      :items="tabItems"
      orientation="vertical"
      variant="link"
      :style="{ '--palette-sticky-top': stickyTop }"
      :ui="{
        root: 'flex flex-col md:flex-row gap-12 items-start overflow-visible',
        list: 'md:w-64 shrink-0 md:sticky md:top-[var(--palette-sticky-top)] self-start z-10 overflow-visible',
        content: 'flex-1 min-w-0'
      }"
    >
      <template #content="{ item }">
        <div class="flex flex-col gap-8">
          <header>
            <h2 class="text-3xl font-bold text-highlighted mb-2">
              {{ item.label }}
            </h2>
            <code class="text-sm text-muted">{{ (item as any).font.family }}</code>
          </header>

          <UAccordion
            multiple
            :items="[
              { label: 'Specimen', slot: 'specimen' },
              { label: 'Hierarchy', slot: 'hierarchy' },
              { label: 'Color Test', slot: 'colors' }
            ]"
            :ui="{
              item: 'border-b border-default last:border-b-0',
              trigger: 'text-xl font-bold py-4',
              body: 'py-6 px-4'
            }"
          >
            <template #specimen>
              <div
                class="flex flex-col gap-4 py-4 text-highlighted"
                :style="getFontStyles((item as any).font.family)"
              >
                <div class="text-4xl break-all line-height-none tracking-tight">
                  {{ alphabet }}
                </div>
                <div class="text-4xl break-all line-height-none tracking-tight">
                  {{ alphabetLower }}
                </div>
                <div class="text-4xl">
                  {{ numbers }}
                </div>
                <div class="text-4xl">
                  {{ symbols }}
                </div>
              </div>
            </template>

            <template #hierarchy>
              <div class="flex flex-col gap-8" :style="getFontStyles((item as any).font.family)">
                <div
                  v-for="h in headingLevels"
                  :key="h.tag"
                  class="flex flex-col md:flex-row md:items-baseline gap-4"
                >
                  <span class="w-12 text-xs text-muted font-mono uppercase shrink-0">{{
                    h.tag
                  }}</span>
                  <component :is="h.tag" class="m-0">{{ h.label }}</component>
                </div>
                <div class="flex flex-col md:flex-row md:items-baseline gap-4">
                  <span class="w-12 text-xs text-muted font-mono uppercase shrink-0">p</span>
                  <p class="m-0 leading-relaxed max-w-2xl">
                    {{ sampleText }}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                  </p>
                </div>
              </div>
            </template>

            <template #colors>
              <div
                class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8"
                :style="getFontStyles((item as any).font.family)"
              >
                <div
                  v-for="c in parsedData.colors"
                  :key="c.name"
                  class="flex flex-col gap-2 p-4 rounded border border-transparent hover:border-default transition-colors"
                >
                  <div class="flex items-center justify-between text-xs font-mono text-muted mb-2">
                    <span>--text-{{ c.name }}</span>
                    <span class="opacity-50 uppercase">{{ c.value }}</span>
                  </div>
                  <div
                    class="p-4 rounded border border-default/10"
                    :class="c.name === 'inverted' ? 'bg-highlighted' : 'bg-default/5'"
                  >
                    <p class="text-xl font-bold" :style="{ color: `var(--text-${c.name})` }">
                      {{ sampleText }}
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </UAccordion>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<style scoped></style>
