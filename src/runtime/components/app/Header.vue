<script setup lang="ts">
import { tv } from "tailwind-variants"

const header = tv({
  slots: {
    root: "sticky top-0 z-50 h-(--ui-header-height)",
    container: "h-full flex flex-row items-center justify-between p-sm",
    left: "hidden lg:flex",
    center: "hidden lg:flex",
    right: "hidden lg:flex",
    collapsedLeft: "lg:hidden",
    collapsedCenter: "lg:hidden",
    collapsedRight: "lg:hidden"
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
      <div :class="collapsedLeft()">
        <slot name="collapsed-left" />
      </div>
      <div :class="collapsedCenter()">
        <slot name="collapsed-center" />
      </div>
      <div :class="collapsedRight()">
        <slot name="collapsed-right" />
      </div>
    </UContainer>
  </header>
</template>

<style scoped></style>
