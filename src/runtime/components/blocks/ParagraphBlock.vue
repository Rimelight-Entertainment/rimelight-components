<script setup lang="ts">
import type { ParagraphBlockProps } from "../../types/blocks"

const { text } = defineProps<ParagraphBlockProps>()
</script>

<template>
  <p>
    <RCTextRenderer :content="text" />
  </p>
</template>
