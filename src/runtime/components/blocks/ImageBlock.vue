<script setup lang="ts">
import type { ImageBlockProps } from "../../types/blocks"

const { src, alt, caption } = defineProps<ImageBlockProps>()
</script>

<template>
  <figure class="mx-auto">
    <img :src="src" :alt="alt" class="h-auto w-full object-cover" />
    <figcaption v-if="caption" class="mt-4 text-center text-sm text-muted">
      {{ caption }}
    </figcaption>
  </figure>
</template>
