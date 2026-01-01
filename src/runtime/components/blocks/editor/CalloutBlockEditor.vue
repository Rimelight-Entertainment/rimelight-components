<script setup lang="ts">
import type { CalloutBlockProps } from "../../../types"
import { tv } from "../../../internal/tv"
import { useRC } from "../../../composables"

export interface CalloutBlockEditorProps extends CalloutBlockProps {
  rc?: {
    root?: string
  }
}

const { variant, children, to, target, rc: rcProp } = defineProps<CalloutBlockEditorProps>()

export interface CalloutBlockEditorEmits {}

const emit = defineEmits<CalloutBlockEditorEmits>()

export interface CalloutBlockEditorSlots {}

const slots = defineSlots<CalloutBlockEditorSlots>()

const { rc } = useRC('CalloutBlockEditor', rcProp)

const calloutBlockEditorStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = calloutBlockEditorStyles()
</script>

<template>
  <div :class="root({ class: rc.root })">
    <RCCallout :variant="variant" :to="to" :target="target">
      <RCBlockViewRenderer :blocks="children" />
    </RCCallout>
  </div>
</template>
