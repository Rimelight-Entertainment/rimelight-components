<script setup lang="ts">
import type { TestBlockProps } from "../../../types"

const { text } = defineProps<TestBlockProps>()
</script>

<template>
  <RCTest :text="text"/>
</template>

<style scoped></style>
