<script setup lang="ts">
import { provide } from "vue"
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
