<script setup lang="ts">
import { computed, inject } from "vue"
import type { SectionBlockProps } from "../../../types" // Adjusted path as needed
import { slugify } from "../../../utils" // Adjusted path as needed

// --- NEW PROPS CONTRACT ---
const props = defineProps<{
  // 1. Specific, type-safe props object
  blockProps: SectionBlockProps
  // 2. ID is still required for external actions (delete, move)
  blockId: string
}>()

// --- MUTATORS & UTILITIES ---

const headingId = computed(() => (props.blockProps.title ? slugify(props.blockProps.title) : undefined))

/**
 * Mutator function to update the title.
 * This directly updates the property on the `blockProps` object passed down.
 * Since the parent `blocks` array is reactive, this mutation is still detected by the composable.
 * @param event The native input event.
 */
const updateTitle = (event: Event) => {
  props.blockProps.title = (event.target as HTMLInputElement).value
}

/**
 * Mutator function to update the description.
 * @param event The native input event.
 */
const updateDescription = (event: Event) => {
  props.blockProps.description = (event.target as HTMLInputElement).value
}

// Inject mutator helpers from the parent EditorBlockRenderer
const { removeBlock } = inject('blockEditorMutators', {
  removeBlock: (id: string) => console.warn(`removeBlock not implemented for ${id}`),
})

const handleRemove = () => {
  // Use the injected helper with the component's own ID
  removeBlock(props.blockId)
}

// Get the children blocks from the SectionBlockProps (which is now available directly)
const childrenBlocks = computed(() => props.blockProps.children || [])
</script>

<template>
  <div class="block-editor-container relative border-2 border-dashed border-primary-200 p-4 rounded-lg bg-primary-50/50 group">

    <div class="absolute -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
      <UButton icon="lucide:trash-2" variant="solid"  size="sm" @click="handleRemove" />
    </div>

    <RCSection
      :level="props.blockProps.level"
      :title="props.blockProps.title"
      :description="props.blockProps.description"
      :id="headingId"
      is-editing
    >
      <template #title>
        <input
          :value="props.blockProps.title"
          @input="updateTitle"
          :class="`text-${props.blockProps.level === 1 ? '3xl' : 'xl'} font-bold w-full focus:outline-none bg-transparent pointer-events-auto`"
          placeholder="Enter section title..."
        />
      </template>

      <template #description>
        <textarea
          v-if="props.blockProps.description !== undefined"
          :value="props.blockProps.description"
          @input="updateDescription"
          class="text-md text-muted w-full resize-none focus:outline-none bg-transparent pointer-events-auto"
          placeholder="Optional description..."
          rows="2"
        />
      </template>

      <div class="mt-4">
        <RCBlockEditorRenderer :blocks="childrenBlocks" />
      </div>

    </RCSection>
  </div>
</template>