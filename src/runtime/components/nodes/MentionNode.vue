<script setup lang="ts">
import { computed } from "vue"

const { href, target, content } = defineProps<{
  href: string
  target?: string
  content: string
}>()

const rel = computed(() =>
  target === "_blank" ? "noopener noreferrer" : undefined
)
</script>

<template>
  <ULink
    :to="href"
    :target="target"
    :rel="rel"
    class="rounded-md bg-secondary-700 px-1.5 py-0.5 text-secondary-300"
  >
    {{ content }}
  </ULink>
</template>
