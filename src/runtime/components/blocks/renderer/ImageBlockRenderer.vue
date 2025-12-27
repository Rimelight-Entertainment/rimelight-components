<script setup lang="ts">
import type { ImageBlockProps } from "../../../types"
import { tv } from "tailwind-variants"

export interface ImageBlockRendererProps extends ImageBlockProps {}

const { src, alt, caption } = defineProps<ImageBlockRendererProps>()

export interface ImageBlockRendererEmits {}

const emit = defineEmits<ImageBlockRendererEmits>()

const imageBlockRendererStyles = tv({
  slots: {
    root: "mx-auto",
    image: "h-auto w-full object-cover",
    caption: "mt-4 text-center text-sm text-muted"
  }
})

const { root, image, caption: captionStyle } = imageBlockRendererStyles()
</script>

<template>
  <figure :class="root()">
    <img :src="src" :alt="alt" :class="image()" />
    <figcaption v-if="caption" :class="captionStyle()">
      {{ caption }}
    </figcaption>
  </figure>
</template>
