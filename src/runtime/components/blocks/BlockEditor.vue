<script setup lang="ts">
import { provide, ref } from "vue"
import type { Block } from "../../types"
import { useBlockEditor, useRC } from "../../composables"
import { type BlockDefinition } from "../../utils/blocks"
import { useI18n } from "vue-i18n"

export interface BlockEditorProps {
  historyLimit?: number
  rc?: {}
}

const { historyLimit, rc: rcProp } = defineProps<BlockEditorProps>()

const blocks = defineModel<Block[]>({ required: true })

export interface BlockEditorEmits {
  save: []
  mutation: []
}

const emit = defineEmits<BlockEditorEmits>()

const { t } = useI18n()
const { rc } = useRC('BlockEditor', rcProp)

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
} = useBlockEditor(blocks, { maxHistorySize: historyLimit, onMutation: () => emit('mutation') })

const isAddBlockModalOpen = ref(false)
const addBlockTarget = ref<{ id: string | null, position: 'before' | 'after' }>({ id: null, position: 'after' })

const openAddBlockModal = (targetId: string | null = null, position: 'before' | 'after' = 'after') => {
  addBlockTarget.value = { id: targetId, position }
  isAddBlockModalOpen.value = true
}

const handleBlockSelect = (definition: BlockDefinition) => {
  insertBlock(definition.type, addBlockTarget.value.id, addBlockTarget.value.position)
}

provide("block-editor-api", {
  removeBlock,
  moveBlock,
  duplicateBlock,
  updateBlockProps,
  insertBlock,
  canUndo,
  canRedo,
  undo,
  redo,
  openAddBlockModal
})

defineExpose({ undo, redo, canUndo, canRedo })
</script>

<template>
  <div class="flex flex-col gap-8 w-full">
    <RCBlockEditRenderer :blocks="blocks" />

    <div class="flex flex-col items-center justify-center p-4 border-t border-neutral-200 dark:border-neutral-800 border-dashed rounded-lg">
      <span class="text-sm text-dimmed mb-2">{{ t('page_editor.append_new_block') }}</span>
      <UButton
        color="neutral"
        :label="t('page_editor.add_block', 'Add Block')"
        variant="outline"
        icon="i-lucide-plus"
        @click="openAddBlockModal()"
      />
    </div>

    <RCAddBlockModal
      v-model:open="isAddBlockModalOpen"
      @select="handleBlockSelect"
    />
  </div>
</template>

<style scoped></style>
