<script setup lang="ts">
import { computed } from "vue"
import type { SectionBlockProps } from "../../types/blocks"
import { slugify } from "../../utils/slugify"

const { level, title, description, children } = defineProps<SectionBlockProps>()
const headingId = computed(() => (title ? slugify(title) : undefined))
</script>

<template>
  <RCSection
    :level="level"
    :title="title"
    :description="description"
    :id="headingId"
  >
    <RCBlockRenderer :blocks="children" />
  </RCSection>
</template>
