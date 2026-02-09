<script setup lang="ts">
import { provide, inject, ref, watch, nextTick, type Ref } from "vue"
import type { Block } from "../../types"
import { useBlockEditor, useRC } from "../../composables"
import { type BlockDefinition } from "../../utils/blocks"
import { useI18n } from "vue-i18n"

export interface BlockEditorProps {
  historyLimit?: number
  containerId?: string | null // ID of container block, null for root
  rc?: {}
}

const { historyLimit, containerId = null, rc: rcProp } = defineProps<BlockEditorProps>()

const blocks = defineModel<Block[]>({ required: true })

console.log('[BlockEditor] Component mounted with', blocks.value.length, 'blocks')

export interface BlockEditorEmits {
  save: []
  mutation: []
  start: []
  end: []
  change: [any]
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
  relocateBlock,
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
  relocateBlock,
  canUndo,
  canRedo,
  undo,
  redo,
  openAddBlockModal
})

// Handle drag start
const handleDragStart = () => {
  console.log('[BlockEditor] Drag started')
  emit('start')
}

// Handle drag end
const handleDragEnd = async () => {
  console.log('[BlockEditor] Drag ended')
  emit('end')
  emit('mutation')
}

// Handle changes from draggable (added, removed, moved)
const handleBlockChange = (event: any) => {
  console.log('[BlockEditor] handleBlockChange:', event)
  emit('change', event)
  
  // We strictly rely on the 'mutation' event for state syncing.
  // Child components (nested editors) now handle their own updates via computed setters,
  // so we don't need complex logic here to prevent race conditions.
  if (event.added || event.removed || event.moved) {
     emit('mutation') 
  }
}

// Watch for blocks changes that come from v-model (drag and drop)
// DISABLED: This was causing premature snapshots that destroyed nested components
// before they could process dropped blocks. We now rely on explicit mutation events.
/*
watch(blocks, async (newVal, oldVal) => {
  const newCount = newVal?.length || 0
  const oldCount = oldVal?.length || 0
  
  if (newCount !== oldCount) {
    console.log('[BlockEditor] Blocks changed via v-model from', oldCount, 'to', newCount)
    
    // CRITICAL: Wait for all nested updates to propagate before emitting mutation
    // This ensures child components have updated their parent block props
    // before the page-level snapshot is captured
    await nextTick()
    console.log('[BlockEditor] After nextTick, emitting mutation')
    emit('mutation')
  }
}, { deep: false }) // Shallow watch - we only care about array length changes from drag/drop
*/

defineExpose({ undo, redo, canUndo, canRedo })
</script>

<template>
  <div class="flex flex-col gap-8 w-full">
    <RCBlockEditRenderer
      v-model:blocks="blocks"
      :container-id="containerId"
      @start="handleDragStart"
      @end="handleDragEnd"
      @change="handleBlockChange"
    />

    <div class="flex flex-col items-center justify-center gap-md p-sm">
      <UButton
        color="neutral"
        :label="t('page_editor.add_block', 'Add Block')"
        variant="outline"
        icon="lucide:plus"
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
