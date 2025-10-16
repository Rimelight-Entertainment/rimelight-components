<script setup lang="ts">
const { copy } = useClipboard()
const toast = useToast()

const { hex, rgb, hsl, oklch, cmyk } = defineProps<{
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

  return "primary-500"
})
</script>

<template>
  <UCard>
    <div class="flex flex-row gap-sm">
      <div class="aspect-square size-64" :class="`bg-[${color}]`" />
      <div class="flex flex-col justify-center gap-sm">
        <UButton
          v-if="hex"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy HEX"
          class="w-32"
          @click="copyToClipboard(hex)"
        />
        <UButton
          v-if="rgb"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy RGB"
          class="w-32"
          @click="copyToClipboard(rgb)"
        />
        <UButton
          v-if="hsl"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy HSL"
          class="w-32"
          @click="copyToClipboard(hsl)"
        />
        <UButton
          v-if="oklch"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy OKLCH"
          class="w-32"
          @click="copyToClipboard(oklch)"
        />
        <UButton
          v-if="cmyk"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          label="Copy CMYK"
          class="w-32"
          @click="copyToClipboard(cmyk)"
        />
      </div>
    </div>
  </UCard>
</template>

<style scoped></style>
