<script setup lang="ts">
const { text } = defineProps<{ text: string }>()
</script>

<template>
  <div v-bind="$attrs">
    <slot name="content">
      <p>{{ text }}</p>
    </slot>
  </div>
</template>

<style scoped></style>
