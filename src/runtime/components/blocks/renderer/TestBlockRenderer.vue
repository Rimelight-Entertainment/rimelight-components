<script setup lang="ts">
import type { TestBlockProps } from "~~/src/runtime/types/blocks"

const { text } = defineProps<TestBlockProps>()
</script>

<template>
  <RCTest :text="text"/>
</template>

<style scoped></style>
