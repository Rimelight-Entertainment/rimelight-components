<script setup lang="ts">
import { computed } from "vue"
import { useClipboard } from "@vueuse/core"
import { useToast } from "@nuxt/ui"

const { copy } = useClipboard()
const toast = useToast()

const { name, hex, rgb, hsl, oklch, cmyk } = defineProps<{
  name?: string
  hex?: string
  rgb?: string
  hsl?: string
  oklch?: string
  cmyk?: string
}>()

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
  <UCard variant="subtle" class="w-full rounded-none xl:w-fit">
    <template #header v-if="name">
      <h3 class="text-lg font-bold">{{ name }}</h3>
    </template>
    <div class="flex flex-col items-center gap-sm xl:flex-row xl:items-start">
      <div
        class="flex aspect-square size-48 p-sm"
        :style="{ backgroundColor: color }"
      >
        <div class="flex flex-col justify-end gap-xs text-xs">
          <span v-if="name" class="text-sm">{{ formatColor(name) }}</span>
          <span v-if="hex">HEX {{ formatColor(hex) }}</span>
          <span v-if="rgb">{{ formatColor(rgb) }}</span>
          <span v-if="hsl">{{ formatColor(hsl) }}</span>
          <span v-if="oklch">{{ formatColor(oklch) }}</span>
          <span v-if="cmyk">{{ formatColor(cmyk) }}</span>
        </div>
      </div>
      <div class="flex w-full flex-col justify-center gap-sm">
        <UButton
          v-if="hex"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy HEX"
          class="w-full xl:w-36"
          @click="copyToClipboard(hex)"
        />
        <UButton
          v-if="rgb"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy RGB"
          class="w-full xl:w-36"
          @click="copyToClipboard(rgb)"
        />
        <UButton
          v-if="hsl"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy HSL"
          class="w-full xl:w-36"
          @click="copyToClipboard(hsl)"
        />
        <UButton
          v-if="oklch"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy OKLCH"
          class="w-full xl:w-36"
          @click="copyToClipboard(oklch)"
        />
        <UButton
          v-if="cmyk"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy CMYK"
          class="w-full xl:w-36"
          @click="copyToClipboard(cmyk)"
        />
      </div>
    </div>
  </UCard>
</template>

<style scoped></style>
