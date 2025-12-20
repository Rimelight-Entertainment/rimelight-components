<script setup lang="ts">
import { tv } from "tailwind-variants"

const header = tv({
  slots: {
    root: "sticky top-0 z-50 h-(--ui-header-height)",
    container: "h-full flex flex-row items-center p-sm",
    left: "hidden lg:flex flex-1 justify-start",
    center: "hidden lg:flex flex-none",
    right: "hidden lg:flex flex-1 justify-end items-end",
    collapsedLeft: "lg:hidden flex-1 justify-start",
    collapsedCenter: "lg:hidden flex-none",
    collapsedRight: "lg:hidden flex-1 justify-end"
  }
})

const {
  root,
  container,
  left,
  center,
  right,
  collapsedLeft,
  collapsedCenter,
  collapsedRight
} = header()
</script>

<template>
  <header :class="root()">
    <UContainer as="div" :class="container()">

      <div :class="[left(), !$slots.left && 'hidden']">
        <slot name="left" />
      </div>

      <div :class="[center(), !$slots.center && 'hidden']">
        <slot name="center" />
      </div>

      <div :class="[right(), !$slots.right && 'hidden']">
        <slot name="right" />
      </div>

      <div :class="[collapsedLeft(), !$slots['collapsed-left'] && 'hidden']">
        <slot name="collapsed-left" />
      </div>

      <div :class="[collapsedCenter(), !$slots['collapsed-center'] && 'hidden']">
        <slot name="collapsed-center" />
      </div>

      <div :class="[collapsedRight(), !$slots['collapsed-right'] && 'hidden']">
        <slot name="collapsed-right" />
      </div>

    </UContainer>
  </header>
</template>

<style scoped></style>
