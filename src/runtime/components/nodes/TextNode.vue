<script setup lang="ts">
import { tv } from "tailwind-variants"

export interface TextNodeProps {
  content: string
}

const { content } = defineProps<TextNodeProps>()

export interface TextNodeEmits {}

const emit = defineEmits<TextNodeEmits>()

const textNodeStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = textNodeStyles()
</script>

<template>
  <span :class="root()">{{ content }}</span>
</template>
