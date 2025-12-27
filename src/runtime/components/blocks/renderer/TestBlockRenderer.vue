<script setup lang="ts">
import type { TestBlockProps } from "../../../types"
import { tv } from "tailwind-variants"

export interface TestBlockRendererProps extends TestBlockProps {}

const { text } = defineProps<TestBlockRendererProps>()

export interface TestBlockRendererEmits {}

const emit = defineEmits<TestBlockRendererEmits>()

const testBlockRendererStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = testBlockRendererStyles()
</script>

<template>
  <RCTest :text="text" />
</template>

<style scoped></style>
