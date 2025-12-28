<script setup lang="ts">
import { tv } from "../../utils/tv"
import { useRC } from "../../composables/useRC"

export interface TextNodeProps {
  content: string
  rc?: {
    root?: string
  }
}

const { content, rc: rcProp } = defineProps<TextNodeProps>()

export interface TextNodeEmits {}

const emit = defineEmits<TextNodeEmits>()

export interface TextNodeSlots {}

const slots = defineSlots<TextNodeSlots>()

const { rc } = useRC('TextNode', rcProp)

const textNodeStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = textNodeStyles()
</script>

<template>
  <span :class="root({ class: rc.root })">{{ content }}</span>
</template>
