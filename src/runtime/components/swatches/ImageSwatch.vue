<script setup lang="ts">
import { computed } from "vue"
import { tv } from "tailwind-variants"

export interface ImageSwatchProps {
  name?: string
  jpg?: string
  png?: string
  webp?: string
  svg?: string
}

const { name, jpg, png, webp, svg } = defineProps<ImageSwatchProps>()

export interface ImageSwatchEmits {}

const emit = defineEmits<ImageSwatchEmits>()

const imageSwatchStyles = tv({
  slots: {
    card: "w-full rounded-none xl:w-fit",
    title: "text-lg font-bold",
    content: "flex flex-col items-center gap-sm xl:flex-row xl:items-start",
    image: "size-48",
    buttonGroup: "flex w-full flex-col justify-center gap-sm",
    button: "w-full xl:w-36"
  }
})

const { card, title: titleStyle, content, image: imageStyle, buttonGroup, button } = imageSwatchStyles()

const image = computed(() => {
  if (webp) return webp
  if (png) return png
  if (jpg) return jpg
  if (svg) return svg

  return undefined
})
</script>

<template>
  <UCard variant="subtle" :class="card()">
    <template #header v-if="name">
      <h3 :class="titleStyle()">{{ name }}</h3>
    </template>
    <div :class="content()">
      <NuxtImg :src="image" :class="imageStyle()" />
      <div :class="buttonGroup()">
        <UButton
          v-if="jpg"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download JPG"
          :class="button()"
          :to="jpg"
          target="_blank"
        />
        <UButton
          v-if="png"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download PNG"
          :class="button()"
          :to="png"
          target="_blank"
        />
        <UButton
          v-if="webp"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download WEBP"
          :class="button()"
          :to="webp"
          target="_blank"
        />
        <UButton
          v-if="svg"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download SVG"
          :class="button()"
          :to="svg"
          target="_blank"
        />
      </div>
    </div>
  </UCard>
</template>
