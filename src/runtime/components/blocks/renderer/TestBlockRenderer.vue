<script setup lang="ts">
import type { TestBlockProps } from "../../../types"
import { tv } from "../../../utils/tv"
import { useRC } from "../../../composables/useRC"

export interface TestBlockRendererProps extends TestBlockProps {
  rc?: {
    root?: string
  }
}

const { text, rc: rcProp } = defineProps<TestBlockRendererProps>()

export interface TestBlockRendererEmits {}

const emit = defineEmits<TestBlockRendererEmits>()

export interface TestBlockRendererSlots {}

const slots = defineSlots<TestBlockRendererSlots>()

const { rc } = useRC('TestBlockRenderer', rcProp)

const testBlockRendererStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = testBlockRendererStyles()
</script>

<template>
  <div :class="root({ class: rc.root })">
    <RCTest :text="text" />
  </div>
</template>

<style scoped></style>
