<script setup lang="ts">
import type { ImageBlockProps } from "../../../types"
import { tv } from "../../../internal/tv"
import { useRC } from "../../../composables"

export interface ImageBlockRendererProps extends ImageBlockProps {
  rc?: {
    root?: string
    image?: string
    caption?: string
  }
}

const { src, alt, caption, rc: rcProp } = defineProps<ImageBlockRendererProps>()

export interface ImageBlockRendererEmits {}

const emit = defineEmits<ImageBlockRendererEmits>()

export interface ImageBlockRendererSlots {}

const slots = defineSlots<ImageBlockRendererSlots>()

const { rc } = useRC('ImageBlockRenderer', rcProp)

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
  <figure :class="root({ class: rc.root })">
    <img :src="src" :alt="alt" :class="image({ class: rc.image })" />
    <figcaption v-if="caption" :class="captionStyle({ class: rc.caption })">
      {{ caption }}
    </figcaption>
  </figure>
</template>
