<script setup lang="ts">
import type { ParagraphBlockProps } from "~~/src/runtime/types/blocks"

const { text } = defineProps<ParagraphBlockProps>()
</script>

<template>
  <p>
    <RCTextRenderer :content="text" />
  </p>
</template>
