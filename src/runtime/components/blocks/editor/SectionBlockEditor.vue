<script setup lang="ts">
import { computed } from "vue"
import type { Block, SectionBlockProps } from "../../../types"
import { slugify } from "../../../utils"
const editorStore = getEditorStoreInstance()

const props = defineProps<{
  block: Block
}>()

// Type assertion for clarity and local access
const sectionProps = computed<SectionBlockProps>(() => {
  // We assume the block type is SectionBlock here based on the mapper
  return props.block.props as SectionBlockProps
})

// --- Computed Values ---

const headingId = computed(() => (sectionProps.value.title ? slugify(sectionProps.value.title) : undefined))

// --- Update Handlers ---

const updateTitle = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  // Calls the centralized, debounced Pinia action
  editorStore.updateBlockContent(props.block.id, 'title', value)
}

const updateDescription = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  // Calls the centralized, debounced Pinia action
  editorStore.updateBlockContent(props.block.id, 'description', value)
}
</script>

<template>
  <div class="block-editor-container border-2 border-dashed border-primary-200 p-4 rounded-lg bg-primary-50/50">
    <RCSection
      :level="sectionProps.level"
      :title="sectionProps.title"
      :description="sectionProps.description"
      :id="headingId"
      is-editing
    >
      <template #title>
        <input
          :value="sectionProps.title"
          @input="updateTitle"
          :class="`text-xl font-bold w-full ${headingId}`"
          placeholder="Enter section title..."
        />
      </template>

      <template #description>
        <input
          v-if="sectionProps.description !== undefined"
          :value="sectionProps.description"
          @input="updateDescription"
          class="text-md text-muted w-full"
          placeholder="Optional description..."
        />
      </template>

      <div class="mt-4">
        <p class="text-xs text-gray-500">Edit children blocks below...</p>
      </div>

    </RCSection>

    <div class="absolute top-0 right-0 p-2">
      <UButton icon="lucide:grip-vertical" variant="ghost" color="gray" size="sm" />
    </div>
  </div>
</template>