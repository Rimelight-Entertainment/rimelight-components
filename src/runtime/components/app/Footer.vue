<script setup lang="ts">
import { tv } from "../../internal/tv"
import { useRC } from "~/src/runtime/composables"

export interface FooterProps {
  contain?: boolean
  rc?: {
    root?: string
    container?: string
    left?: string
    center?: string
    right?: string
  }
}

const { contain = true, rc: rcProp } = defineProps<FooterProps>()

export interface FooterEmits {}

const emit = defineEmits<FooterEmits>()

export interface FooterSlots {
  left: (props: {}) => any
  center: (props: {}) => any
  right: (props: {}) => any
}

const slots = defineSlots<FooterSlots>()

const { rc } = useRC('Footer', rcProp)

const footerStyles = tv({
  slots: {
    root: "py-8 lg:py-12",
    container: "flex flex-col justify-between gap-xl lg:flex-row lg:items-stretch",
    left: "order-last flex flex-col items-center justify-between gap-xl lg:order-1 lg:flex-none lg:items-start",
    center: "flex flex-col items-center justify-start lg:order-2 lg:flex-1",
    right: "order-first flex flex-col items-center justify-between gap-xl lg:order-3 lg:flex-none lg:items-end"
  },
  variants: {
    contain: {
      false: {
        container: "max-w-none"
      }
    }
  }
})

const { root, container, left, center, right } = footerStyles({ contain })
</script>

<template>
  <footer :class="root({ class: rc.root })">
    <UContainer :class="container({ class: rc.container })">
      <div :class="left({ class: rc.left })">
        <slot name="left" />
      </div>
      <div :class="center({ class: rc.center })">
        <slot name="center" />
      </div>
      <div :class="right({ class: rc.right })">
        <slot name="right" />
      </div>
    </UContainer>
  </footer>
</template>

<style scoped></style>
