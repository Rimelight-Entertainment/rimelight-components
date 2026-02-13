<script setup lang="ts">
import { tv } from "../../internal/tv"
import { useRC } from "../../composables"

export interface PlaceholderProps {
  rc?: {
    base?: string
    svg?: string
  }
}

const { rc: rcProp } = defineProps<PlaceholderProps>()

export interface PlaceholderEmits {}

const emit = defineEmits<PlaceholderEmits>()

export interface PlaceholderSlots {
  default: (props: {}) => any
}

const slots = defineSlots<PlaceholderSlots>()

const { rc } = useRC('Placeholder', rcProp)

const placeholderStyles = tv({
  slots: {
    base: "relative flex items-center justify-center overflow-hidden rounded-sm border border-dashed border-accented px-4 opacity-75",
    svg: "absolute inset-0 h-full w-full stroke-inverted/10"
  }
})

const { base, svg } = placeholderStyles()
</script>

<template>
  <div :class="base({ class: rc.base })">
    <svg :class="svg({ class: rc.svg })">
      <defs>
        <pattern
          id="pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e"
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" />
        </pattern>
      </defs>
      <rect
        stroke="none"
        fill="url(#pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e)"
        width="100%"
        height="100%"
      />
    </svg>

    <slot />
  </div>
</template>
