<script setup lang="ts">
import { tv } from "tailwind-variants"

export interface FooterProps {}

const {} = defineProps<FooterProps>()

export interface FooterEmits {}

const emit = defineEmits<FooterEmits>()

const footerStyles = tv({
  slots: {
    root: "py-8 lg:py-12",
    container: "flex flex-col justify-between gap-xl lg:flex-row",
    left: "order-last flex flex-col items-center justify-between gap-xl lg:order-1 lg:items-start",
    center: "flex flex-col items-start lg:order-2",
    right: "order-first flex flex-col items-center justify-between gap-xl lg:order-3 lg:flex-1 lg:items-end"
  }
})

const { root, container, left, center, right } = footerStyles()
</script>

<template>
  <footer :class="root()">
    <UContainer :class="container()">
      <div :class="left()">
        <slot name="left" />
      </div>
      <div :class="center()">
        <slot name="center" />
      </div>
      <div :class="right()">
        <slot name="right" />
      </div>
    </UContainer>
  </footer>
</template>

<style scoped></style>
