<script setup lang="ts">
import { provide, computed } from "vue"
import type { Block } from "../../types"
import { useBlockEditor } from "../../composables"
import { tv } from "../../internal/tv"
import { useRC } from "../../composables"

export interface BlockEditorProps {
  historyLimit?: number
  rc?: {}
}

const { historyLimit, rc: rcProp } = defineProps<BlockEditorProps>()

const blocks = defineModel<Block[]>({ required: true })

export interface BlockEditorEmits {
  save: []
}

const emit = defineEmits<BlockEditorEmits>()

export interface BlockEditorSlots {}

const slots = defineSlots<BlockEditorSlots>()
const blockTypes = [
  { label: 'Paragraph', value: 'ParagraphBlock', icon: 'i-lucide-pilcrow' },
  { label: 'Section', value: 'SectionBlock', icon: 'i-lucide-heading' },
  { label: 'Image', value: 'ImageBlock', icon: 'i-lucide-image' },
  { label: 'Callout', value: 'CalloutBlock', icon: 'i-lucide-info' },
  { label: 'Quote', value: 'QuoteBlock', icon: 'i-lucide-quote' },
  { label: 'List', value: 'UnorderedListBlock', icon: 'i-lucide-list' },
  { label: 'Card', value: 'CardBlock', icon: 'i-lucide-square' },
  { label: 'Collapsible Card', value: 'CollapsibleCardBlock', icon: 'i-lucide-chevron-right-square' }
]

const { rc } = useRC('BlockEditor', rcProp)

//const blockEditorStyles = tv({})

//const {} = blockEditorStyles()

const {
  removeBlock,
  moveBlock,
  duplicateBlock,
  updateBlockProps,
  insertBlock,
  undo,
  redo,
  canUndo,
  canRedo
} = useBlockEditor(blocks, { maxHistorySize: historyLimit })

const dropdownItems = computed(() => [
  blockTypes.map(type => ({
    label: type.label,
    icon: type.icon,
    click: () => insertBlock(type.value as any)
  }))
])

provide("block-editor-api", {
  removeBlock,
  moveBlock,
  duplicateBlock,
  updateBlockProps,
  insertBlock,
  canUndo,
  canRedo,
  undo,
  redo
})

defineExpose({ undo, redo, canUndo, canRedo })
</script>

<template>
  <div class="flex flex-col gap-8 w-full">
    <RCBlockEditRenderer :blocks="blocks" />

    <div class="flex flex-col items-center justify-center p-4 border-t border-neutral-200 dark:border-neutral-800 border-dashed rounded-lg">
      <span class="text-sm text-dimmed mb-2">Append new block to page</span>
      <UDropdown
        :items="dropdownItems"
        :popper="{ placement: 'bottom' }"
      >
        <UButton
          color="white"
          label="Add Block"
          trailing-icon="i-heroicons-chevron-down-20-solid"
          variant="solid"
          icon="i-lucide-plus"
        />
      </UDropdown>
    </div>
  </div>
</template>

<style scoped></style>
