<script setup lang="ts">
import type { UnorderedListBlockProps } from "../../types/blocks"

const { items } = defineProps<UnorderedListBlockProps>()
</script>

<template>
  <ul class="ml-6 list-outside list-disc space-y-2">
    <li v-for="item in items" :key="item.id" class="list-item">
      <RCBlockRenderer :blocks="[item]" />
    </li>
  </ul>
</template>
