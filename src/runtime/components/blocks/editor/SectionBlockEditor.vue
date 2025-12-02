<script setup lang="ts">
import { computed, ref, watch } from "vue"
import type {
  SectionBlockProps
} from "~~/src/runtime/types/blocks"
import { slugify } from "../../../utils"

const { level, title, description, children } = defineProps<SectionBlockProps>()

const titleCharacterCount = 128
const descriptionCharacterCount = 256

const localTitle = ref(title || "")
const localDescription = ref(description || "")

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
      <UInput v-model="localTitle" :maxlength="titleCharacterCount" type="text" variant="ghost" placeholder="Section title" class="w-full">
        <template #trailing>
          <div
            id="character-count"
            class="text-xs text-dimmed tabular-nums"
            aria-live="polite"
            role="status"
          >
            {{ localTitle?.length }}/{{ titleCharacterCount }}
          </div>
        </template>
      </UInput>
    </template>

    <template #description>
      <UTextarea v-model="localDescription" :maxlength="descriptionCharacterCount" variant="ghost" autoresize placeholder="Section description" class="w-full">
        <template #trailing>
          <div
            id="character-count"
            class="text-xs text-dimmed tabular-nums"
            aria-live="polite"
            role="status"
          >
            {{ localDescription?.length }}/{{ descriptionCharacterCount }}
          </div>
        </template>
      </UTextarea>
    </template>
    <RCBlockEditor :blocks="children" />
  </RCSection>
</template>