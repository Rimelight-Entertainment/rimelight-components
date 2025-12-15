<script setup lang="ts">
import type { ParagraphBlockProps } from "~~/src/runtime/types/blocks"

const { text } = defineProps<ParagraphBlockProps>()
</script>

<template>
  <RCTextRenderer :content="text" />
</template>
