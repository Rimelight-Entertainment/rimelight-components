<script setup lang="ts">
const { content } = defineProps<{
  content: string
}>()
</script>

<template>
  <span>{{ content }}</span>
</template>
