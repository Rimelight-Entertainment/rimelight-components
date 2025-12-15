<script setup lang="ts">
import { provide } from "vue"
import type { Block } from "../../types/blocks"
import { useBlockEditor } from "../../composables/useBlockEditor"

const blocks = defineModel<Block[]>({ required: true })

const emit = defineEmits<{
  (e: "update:modelValue", value: Block[]): void
  (e: "save"): void
}>()

const {
  removeBlock,
  moveBlock,
  duplicateBlock,
  updateBlockProps,
  insertBlock
} = useBlockEditor(blocks)

provide("block-editor-api", {
  removeBlock,
  moveBlock,
  duplicateBlock,
  updateBlockProps,
  insertBlock
})

const handleSave = () => {
  emit("save")
}
</script>

<template>
  <div class="pl-8">
    <RCBlockEditRenderer :blocks="blocks" />
  </div>
</template>

<style scoped></style>