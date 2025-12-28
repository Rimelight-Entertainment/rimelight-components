<script setup lang="ts">
import { computed } from "vue"
import { useClipboard } from "@vueuse/core"
import { useToast } from "@nuxt/ui/composables"
import { tv } from "../../utils/tv"
import { useRC } from "../../composables/useRC"

export interface ColorSwatchProps {
  name?: string
  hex?: string
  rgb?: string
  hsl?: string
  oklch?: string
  cmyk?: string
  rc?: {
    card?: string
    title?: string
    content?: string
    preview?: string
    details?: string
    buttonGroup?: string
    button?: string
  }
}

const { name, hex, rgb, hsl, oklch, cmyk, rc: rcProp } = defineProps<ColorSwatchProps>()

export interface ColorSwatchEmits {}

const emit = defineEmits<ColorSwatchEmits>()

export interface ColorSwatchSlots {}

const slots = defineSlots<ColorSwatchSlots>()

const { rc } = useRC('ColorSwatch', rcProp)

const colorSwatchStyles = tv({
  slots: {
    card: "w-full rounded-none xl:w-fit",
    title: "text-lg font-bold",
    content: "flex flex-col items-center gap-sm xl:flex-row xl:items-start",
    preview: "flex aspect-square size-48 p-sm",
    details: "flex flex-col justify-end gap-xs text-xs",
    buttonGroup: "flex w-full flex-col justify-center gap-sm",
    button: "w-full xl:w-36"
  }
})

const {
  card,
  title: titleStyle,
  content,
  preview,
  details,
  buttonGroup,
  button
} = colorSwatchStyles()

const { copy } = useClipboard()
const toast = useToast()

const copyToClipboard = async (text: string) => {
  try {
    await copy(`${text}`)
    toast.add({
      title: "Color copied to clipboard!",
      description: text,
      color: "success"
    })
  } catch {
    toast.add({
      title: "Failed to copy color to clipboard.",
      description: "An unexpected error occurred. Please try again.",
      color: "error"
    })
  }
}

function formatColor(color: string) {
  return color
    .toUpperCase()
    .replace(/[)]/g, "")
    .replace(/[(]/g, " ")
    .replace(/%/g, "")
}

const color = computed(() => {
  if (hex) return hex
  if (rgb) return rgb
  if (hsl) return hsl
  if (cmyk) return cmyk
  if (oklch) return oklch

  return "var(--color-primary-500)"
})
</script>

<template>
  <UCard variant="subtle" :class="card({ class: rc.card })">
    <template #header v-if="name">
      <h3 :class="titleStyle({ class: rc.title })">{{ name }}</h3>
    </template>
    <div :class="content({ class: rc.content })">
      <div :class="preview({ class: rc.preview })" :style="{ backgroundColor: color }">
        <div :class="details({ class: rc.details })">
          <span v-if="name" class="text-sm">{{ formatColor(name) }}</span>
          <span v-if="hex">HEX {{ formatColor(hex) }}</span>
          <span v-if="rgb">{{ formatColor(rgb) }}</span>
          <span v-if="hsl">{{ formatColor(hsl) }}</span>
          <span v-if="oklch">{{ formatColor(oklch) }}</span>
          <span v-if="cmyk">{{ formatColor(cmyk) }}</span>
        </div>
      </div>
      <div :class="buttonGroup({ class: rc.buttonGroup })">
        <UButton
          v-if="hex"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy HEX"
          :class="button({ class: rc.button })"
          @click="copyToClipboard(hex)"
        />
        <UButton
          v-if="rgb"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy RGB"
          :class="button({ class: rc.button })"
          @click="copyToClipboard(rgb)"
        />
        <UButton
          v-if="hsl"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy HSL"
          :class="button({ class: rc.button })"
          @click="copyToClipboard(hsl)"
        />
        <UButton
          v-if="oklch"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy OKLCH"
          :class="button({ class: rc.button })"
          @click="copyToClipboard(oklch)"
        />
        <UButton
          v-if="cmyk"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy CMYK"
          :class="button({ class: rc.button })"
          @click="copyToClipboard(cmyk)"
        />
      </div>
    </div>
  </UCard>
</template>

<style scoped></style>
