<script setup lang="ts">
import { computed } from "vue"
import type { SectionBlockProps } from "../../../types"
import { slugify } from "../../../utils"
import { tv } from "tailwind-variants"

export interface SectionBlockRendererProps extends SectionBlockProps {}

const { level, title, description, children } = defineProps<SectionBlockRendererProps>()

export interface SectionBlockRendererEmits {}

const emit = defineEmits<SectionBlockRendererEmits>()

const sectionBlockRendererStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = sectionBlockRendererStyles()

const headingId = computed(() => (title ? slugify(title) : undefined))
const hasChildren = computed(() => children && children.length > 0)
</script>

<template>
  <RCSection :level="level" :title="title" :description="description" :id="headingId">
    <RCBlockViewRenderer v-if="hasChildren" :blocks="children" />
  </RCSection>
</template>
