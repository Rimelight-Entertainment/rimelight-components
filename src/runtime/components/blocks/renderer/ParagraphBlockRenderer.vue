<script setup lang="ts">
import type { ParagraphBlockProps } from "../../../types"
import { tv } from "../../../internal/tv"
import { useRC } from "~/src/runtime/composables"

export interface ParagraphBlockRendererProps extends ParagraphBlockProps {
  rc?: {
    root?: string
  }
}

const { text, rc: rcProp } = defineProps<ParagraphBlockRendererProps>()

export interface ParagraphBlockRendererEmits {}

const emit = defineEmits<ParagraphBlockRendererEmits>()

export interface ParagraphBlockRendererSlots {}

const slots = defineSlots<ParagraphBlockRendererSlots>()

const { rc } = useRC('ParagraphBlockRenderer', rcProp)

const paragraphBlockRendererStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = paragraphBlockRendererStyles()
</script>

<template>
  <div :class="root({ class: rc.root })">
    <RCTextRenderer :content="text" />
  </div>
</template>
