<script setup lang="ts">
import type { CalloutBlockProps } from "../../../types"
import { tv } from "../../../utils/tv"
import { useRC } from "../../../composables/useRC"

export interface CalloutBlockRendererProps extends CalloutBlockProps {
  rc?: {
    root?: string
  }
}

const { variant, children, to, target, rc: rcProp } = defineProps<CalloutBlockRendererProps>()

export interface CalloutBlockRendererEmits {}

const emit = defineEmits<CalloutBlockRendererEmits>()

export interface CalloutBlockRendererSlots {}

const slots = defineSlots<CalloutBlockRendererSlots>()

const { rc } = useRC('CalloutBlockRenderer', rcProp)

const calloutBlockRendererStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = calloutBlockRendererStyles()
</script>

<template>
  <div :class="root({ class: rc.root })">
    <RCCallout :variant="variant" :to="to" :target="target">
      <RCBlockViewRenderer :blocks="children" />
    </RCCallout>
  </div>
</template>
