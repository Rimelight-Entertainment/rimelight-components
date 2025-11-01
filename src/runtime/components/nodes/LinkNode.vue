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
  <ULink :to="href" :target="target" :rel="rel">{{ content }}</ULink>
</template>
