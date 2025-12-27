<script setup lang="ts">
import { provide } from "vue"
import type { Block } from "../../types"
import { useBlockEditor } from "../../composables"
import { tv } from "tailwind-variants"

export interface BlockEditorProps {
  historyLimit?: number
}

const { historyLimit } = defineProps<BlockEditorProps>()

export interface BlockEditorEmits {
  (e: "save"): void
}

const emit = defineEmits<BlockEditorEmits>()

const blocks = defineModel<Block[]>({ required: true })

const blockEditorStyles = tv({})

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
  <RCBlockEditRenderer :blocks="blocks" />
</template>

<style scoped></style>
