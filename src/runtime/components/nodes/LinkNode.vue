<script setup lang="ts">
import { computed } from "vue"
import { tv } from "../../internal/tv"
import { useRC } from "../../composables"

export interface LinkNodeProps {
  href: string
  target?: string
  content: string
  rc?: {
    root?: string
  }
}

const { href, target, content, rc: rcProp } = defineProps<LinkNodeProps>()

export interface LinkNodeEmits {}

const emit = defineEmits<LinkNodeEmits>()

export interface LinkNodeSlots {}

const slots = defineSlots<LinkNodeSlots>()

const { rc } = useRC('LinkNode', rcProp)

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
  <ULink :to="href" :target="target" :rel="rel" :class="root({ class: rc.root })">
    {{ content }}
  </ULink>
</template>
