<script setup lang="ts">
import { useClipboard } from "#imports"
import { useToast } from "#imports"
import { computed } from "#imports"

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
      title: `Color copied to clipboard!`,
      description: text,
      color: `success`
    })
  } catch {
    toast.add({
      title: `Failed to copy color to clipboard.`,
      description: `An unexpected error occurred. Please try again.`,
      color: `error`
    })
  }
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
  <UCard variant="subtle" class="w-fit rounded-none">
    <template #header v-if="name">
      <h3 class="text-lg font-bold">{{ name }}</h3>
    </template>
    <div class="gap-sm flex flex-row">
      <div class="aspect-square size-48" :style="{ backgroundColor: color }" />
      <div class="gap-sm flex flex-col justify-center">
        <UButton
          v-if="hex"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy HEX"
          class="w-28"
          @click="copyToClipboard(hex)"
        />
        <UButton
          v-if="rgb"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy RGB"
          class="w-28"
          @click="copyToClipboard(rgb)"
        />
        <UButton
          v-if="hsl"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy HSL"
          class="w-28"
          @click="copyToClipboard(hsl)"
        />
        <UButton
          v-if="oklch"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy OKLCH"
          class="w-28"
          @click="copyToClipboard(oklch)"
        />
        <UButton
          v-if="cmyk"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy CMYK"
          class="w-28"
          @click="copyToClipboard(cmyk)"
        />
      </div>
    </div>
  </UCard>
</template>

<style scoped></style>
