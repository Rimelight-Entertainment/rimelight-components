<script setup lang="ts">
import type { ParagraphBlockProps } from "../../../types"

const { text } = defineProps<ParagraphBlockProps>()
</script>

<template>
  <RCTextRenderer :content="text" />
</template>
