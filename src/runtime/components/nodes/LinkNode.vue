<script setup lang="ts">
import { computed } from "vue"
import { tv } from "tailwind-variants"

export interface LinkNodeProps {
  href: string
  target?: string
  content: string
}

const { href, target, content } = defineProps<LinkNodeProps>()

export interface LinkNodeEmits {}

const emit = defineEmits<LinkNodeEmits>()

const linkNodeStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = linkNodeStyles()

const rel = computed(() =>
  target === "_blank" ? "noopener noreferrer" : undefined
)
</script>

<template>
  <ULink :to="href" :target="target" :rel="rel" :class="root()">
    {{ content }}
  </ULink>
</template>
