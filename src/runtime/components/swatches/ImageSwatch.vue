<script setup lang="ts">
import { useClipboard } from "#imports"
import { useToast } from "#imports"
import { computed } from "#imports"

const { name, jpg, png, webp, svg } = defineProps<{
  name?: string
  jpg?: string
  png?: string
  webp?: string
  svg?: string
}>()

const image = computed(() => {
  if (webp) return webp
  if (png) return png
  if (jpg) return jpg
  if (svg) return svg

  return undefined
})
</script>

<template>
  <UCard variant="subtle" class="w-fit rounded-none">
    <template #header v-if="name">
      <h3 class="text-lg font-bold">{{ name }}</h3>
    </template>
    <div class="gap-sm flex flex-row">
      <NuxtImg :src="image" class="size-48" />
      <div class="gap-sm flex flex-col justify-center">
        <UButton
          v-if="jpg"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download JPG"
          class="w-36"
          :to="jpg"
          target="_blank"
        />
        <UButton
          v-if="png"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download PNG"
          class="w-36"
          :to="png"
          target="_blank"
        />
        <UButton
          v-if="webp"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download WEBP"
          class="w-36"
          :to="webp"
          target="_blank"
        />
        <UButton
          v-if="svg"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download SVG"
          class="w-36"
          :to="svg"
          target="_blank"
        />
      </div>
    </div>
  </UCard>
</template>
