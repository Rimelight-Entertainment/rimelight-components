<script setup lang="ts">
import { type Component, inject, provide } from "vue"
import { getBlockEditorComponent } from "../../utils/blockMapper"
import type { Block } from "../../types/blocks"

const { blocks } = defineProps<{
  blocks: Block[]
}>()

const { removeBlock, moveBlock } = inject('blockEditorMutators', {
  removeBlock: (id: string) => console.warn(`[Renderer] removeBlock not provided. Cannot delete block ${id}.`),
  moveBlock: (id: string, newIndex: number) => console.warn(`[Renderer] moveBlock not provided. Cannot move block ${id}.`),
})

// --- 2. Provide Mutators to Child Editor Blocks ---
// The editor blocks (like SectionBlockEditor) will inject these.
provide('blockEditorMutators', { removeBlock, moveBlock })

/**
 * Resolves the appropriate editor component for a given block object.
 * This uses the getBlockEditorComponent utility.
 *
 * @param block The block object containing the type and props.
 * @returns The lazily loaded Vue component reference, or null on error.
 */
const getComponent = (block: Block): Component | null => {
  if (!block || !block.type || block.type.length === 0) {
    console.error(
        "[EditorBlockRenderer] Block object is missing the critical 'type' field."
    )
    return null
  }

  const resolvedComponent = getBlockEditorComponent(block.type)

  if (!resolvedComponent) {
    console.error(
        `[EditorBlockRenderer] Editor component resolution failed for block type: ${block.type}`
    )
    return null
  }

  return resolvedComponent
}
</script>

<template>
  <div class="flex flex-col gap-lg editor-block-renderer">
    <UEmpty
        v-if="!blocks || blocks.length === 0"
        variant="naked"
        icon="lucide:pencil-line"
        title="Start adding content blocks."
        description="There is no content yet. Use the '+' button below to add your first block."
    />
    <template v-else v-for="block in blocks" :key="block.id">
      <template v-if="getComponent(block)">
        <component
            :is="getComponent(block)"
            v-bind="block.props"
            :key="block.id"
            :type="block.type"
            class="block-editor-container"
        />
      </template>
      <template v-else>
        <UAlert
            color="warning"
            variant="subtle"
            icon="lucide:octagon-alert"
            title="Editor Rendering Error"
            :description="`Editor component for type '${block.type || 'UNKNOWN_OR_MISSING'}' was not found. Please ensure the block name is correct and the editor component exists in the 'editor' subdirectory.`"
        />
      </template>
    </template>
  </div>
</template>

<style scoped>
/* Scoped styles can be added here, for example to add a clear border/outline
   to the entire editor area */
.editor-block-renderer {
  min-height: 200px;
  padding: 1rem;
  /* Example style: A light visual distinction for the editable area */
  /* border: 1px dashed var(--color-gray-300); */
}
</style>