<script setup lang="ts">
import { tv } from "tailwind-variants"

export interface TestProps {
  text: string
}

export interface TestEmits {}

const { text } = defineProps<TestProps>()
const emit = defineEmits<TestEmits>()

const testStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = testStyles()
</script>

<template>
  <div :class="root()" v-bind="$attrs">
    <slot name="content">
      <p>{{ text }}</p>
    </slot>
  </div>
</template>

<style scoped></style>
