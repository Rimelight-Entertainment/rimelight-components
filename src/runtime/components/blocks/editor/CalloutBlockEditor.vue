<script setup lang="ts">
import type { CalloutBlockProps } from "../../../types"
import { tv } from "tailwind-variants"

export interface CalloutBlockEditorProps extends CalloutBlockProps {}

const { variant, children, to, target } = defineProps<CalloutBlockEditorProps>()

export interface CalloutBlockEditorEmits {}

const emit = defineEmits<CalloutBlockEditorEmits>()

const calloutBlockEditorStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = calloutBlockEditorStyles()
</script>

<template>
  <RCCallout :variant="variant" :to="to" :target="target">
    <RCBlockViewRenderer :blocks="children" />
  </RCCallout>
</template>
