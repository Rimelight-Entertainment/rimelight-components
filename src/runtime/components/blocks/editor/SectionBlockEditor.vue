<script setup lang="ts">
import { computed } from "vue"
import type {
  SectionBlockProps
} from "~~/src/runtime/types/blocks"
import { slugify } from "../../../utils"

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
    <template #title>
      <input
          :value="title"
          :class="`text-${level === 1 ? '3xl' : 'xl'} pointer-events-auto w-full bg-transparent font-bold focus:outline-none`"
          placeholder="Enter section title..."
      />
    </template>

    <template #description>
        <textarea
            :value="description"
            class="text-md pointer-events-auto w-full resize-none bg-transparent text-muted focus:outline-none"
            placeholder="Optional description..."
            rows="2"
        />
    </template>
    <RCBlockEditor :blocks="children" />
  </RCSection>
</template>