<script setup lang="ts">
import { tv } from "../../internal/tv"
import { useRC } from "../../composables/useRC"

export interface HeaderProps {
  contain?: boolean
  rc?: {
    root?: string
    container?: string
    left?: string
    center?: string
    right?: string
    collapsedLeft?: string
    collapsedCenter?: string
    collapsedRight?: string
  }
}

const { contain = true, rc: rcProp } = defineProps<HeaderProps>()

export interface HeaderEmits {}

const emit = defineEmits<HeaderEmits>()

export interface HeaderSlots {
  left: (props: {}) => any
  center: (props: {}) => any
  right: (props: {}) => any
  "collapsed-left": (props: {}) => any
  "collapsed-center": (props: {}) => any
  "collapsed-right": (props: {}) => any
}

const slots = defineSlots<HeaderSlots>()

const { rc } = useRC('Header', rcProp)

const headerStyles = tv({
  slots: {
    root: "h-(--ui-header-height)",
    container: "h-full flex flex-row items-center p-sm",
    left: "hidden lg:flex flex-1 justify-start",
    center: "hidden lg:flex flex-none",
    right: "hidden lg:flex flex-1 justify-end items-end",
    collapsedLeft: "lg:hidden flex-1 justify-start",
    collapsedCenter: "lg:hidden flex-none",
    collapsedRight: "lg:hidden flex-1 justify-end"
  },
  variants: {
    contain: {
      false: {
        container: "max-w-none"
      }
    }
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
} = headerStyles({ contain })
</script>

<template>
  <header :class="root({ class: rc.root })">
    <UContainer :class="container({ class: rc.container })">
      <div :class="left({ class: rc.left })"><slot name="left" /></div>
      <div :class="center({ class: rc.center })"><slot name="center" /></div>
      <div :class="right({ class: rc.right })"><slot name="right" /></div>
      <div :class="collapsedLeft({ class: rc.collapsedLeft })"><slot name="collapsed-left" /></div>
      <div :class="collapsedCenter({ class: rc.collapsedCenter })"><slot name="collapsed-center" /></div>
      <div :class="collapsedRight({ class: rc.collapsedRight })"><slot name="collapsed-right" /></div>
    </UContainer>
  </header>
</template>

<style scoped></style>
