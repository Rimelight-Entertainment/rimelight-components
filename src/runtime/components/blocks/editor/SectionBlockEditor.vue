<script setup lang="ts">
import { computed, inject } from "vue"
import type {
  SectionBlockEditorProps
} from "~~/src/runtime/types/blocks"
import { slugify } from "../../../utils"

const props = defineProps<SectionBlockEditorProps>()

const headingId = computed(() => (props.title ? slugify(props.title) : undefined))

const { removeBlock } = inject('blockEditorMutators', {
  removeBlock: (id: string) => console.warn(`removeBlock not implemented for ${id}`),
})

const handleRemove = () => {
  removeBlock(props.blockId)
}

const childrenBlocks = computed(() => props.children || [])
</script>

<template>
  <div
    class="block-editor-container group relative rounded-lg border-2 border-dashed border-primary-200 bg-primary-50/50 p-4"
  >
    <div
      class="absolute z-10 flex -translate-x-1/2 gap-2 opacity-0 transition-opacity group-hover:opacity-100"
    >
      <UButton
        icon="lucide:trash-2"
        variant="solid"
        size="sm"
        @click="handleRemove"
      />
    </div>

    <RCSection
      :level="level"
      :title="title"
      :description="description"
      :id="headingId"
      is-editing
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
          v-if="description !== undefined"
          :value="description"
          class="text-md pointer-events-auto w-full resize-none bg-transparent text-muted focus:outline-none"
          placeholder="Optional description..."
          rows="2"
        />
      </template>

      <div class="mt-4">
        <RCEditorBlockRenderer :blocks="childrenBlocks" />
      </div>
    </RCSection>
  </div>
</template>