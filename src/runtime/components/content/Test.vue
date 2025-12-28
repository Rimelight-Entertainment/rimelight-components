<script setup lang="ts">
import { tv } from "../../internal/tv"
import { useRC } from "../../composables/useRC"

export interface TestProps {
  text: string
  rc?: {
    root?: string
  }
}

const { text, rc: rcProp } = defineProps<TestProps>()

export interface TestEmits {}

const emit = defineEmits<TestEmits>()

export interface TestSlots {
  content: (props: {}) => any
}

const slots = defineSlots<TestSlots>()

const { rc } = useRC('Test', rcProp)

const testStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = testStyles()
</script>

<template>
  <div :class="root({ class: rc.root })" v-bind="$attrs">
    <slot name="content">
      <p>{{ text }}</p>
    </slot>
  </div>
</template>

<style scoped></style>
