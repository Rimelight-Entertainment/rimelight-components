<script setup lang="ts">
import type { ParagraphBlockProps } from "../../../types"
import { tv } from "tailwind-variants"

export interface ParagraphBlockRendererProps extends ParagraphBlockProps {}

const { text } = defineProps<ParagraphBlockRendererProps>()

export interface ParagraphBlockRendererEmits {}

const emit = defineEmits<ParagraphBlockRendererEmits>()

const paragraphBlockRendererStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = paragraphBlockRendererStyles()
</script>

<template>
  <RCTextRenderer :content="text" />
</template>
