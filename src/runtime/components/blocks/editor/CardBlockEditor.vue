<script setup lang="ts">
import type { CardBlockProps } from "../../../types"

const { title, to, target, children } = defineProps<CardBlockProps>()
</script>

<template>
  <NuxtLink :to="to" :target="target">
    <UCard class="flex h-full flex-col">
      <h3>{{ title }}</h3>
      <RCBlockEditRenderer :blocks="children" />
    </UCard>
  </NuxtLink>
</template>
