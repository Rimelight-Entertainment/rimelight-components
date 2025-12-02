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
      <UInput :v-model="title" :maxlength="128" type="text" variant="ghost" placeholder="Section title">
        <template #trailing>
          <div
            id="character-count"
            class="text-xs text-muted tabular-nums"
            aria-live="polite"
            role="status"
          >
            {{ description?.length }}/{{ 256 }}
          </div>
        </template>
      </UInput>
    </template>

    <template #description>
      <UTextarea :v-model="description" :maxlength="256" variant="ghost" autoresize placeholder="Section description">
        <template #trailing>
          <div
            id="character-count"
            class="text-xs text-muted tabular-nums"
            aria-live="polite"
            role="status"
          >
            {{ description?.length }}/{{ 256 }}
          </div>
        </template>
      </UTextarea>
    </template>
    <RCBlockEditor :blocks="children" />
  </RCSection>
</template>