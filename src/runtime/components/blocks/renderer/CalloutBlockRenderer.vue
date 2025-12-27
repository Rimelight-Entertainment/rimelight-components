<script setup lang="ts">
import type { CalloutBlockProps } from "../../../types"
import { tv } from "tailwind-variants"

export interface CalloutBlockRendererProps extends CalloutBlockProps {}

const { variant, children, to, target } = defineProps<CalloutBlockRendererProps>()

export interface CalloutBlockRendererEmits {}

const emit = defineEmits<CalloutBlockRendererEmits>()

const calloutBlockRendererStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = calloutBlockRendererStyles()
</script>

<template>
  <RCCallout :variant="variant" :to="to" :target="target">
    <RCBlockViewRenderer :blocks="children" />
  </RCCallout>
</template>
