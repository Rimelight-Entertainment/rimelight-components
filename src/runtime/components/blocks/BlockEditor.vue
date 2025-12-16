<script setup lang="ts">
import { provide, ref, computed } from "vue"
import type { Block } from "../../types/blocks"
import { useBlockEditor } from "../../composables/useBlockEditor"

const blocks = defineModel<Block[]>({ required: true })

export interface BlockEditorProps {
  historyLimit?: number
  isSaving: boolean
}

const { historyLimit, isSaving } = defineProps<BlockEditorProps>()

export interface BlockEditorEmits {
  (e: "save"): void
}

const emit = defineEmits<BlockEditorEmits>()

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
} = useBlockEditor(blocks, historyLimit)

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

const handleSave = () => {
  emit("save")
}

const showPreview = ref(false)

// 2. Computed class for the dynamic grid structure
const gridClass = computed(() => ({
  // The base grid: transitions enable smooth resizing
  'grid transition-[grid-template-columns] duration-300 ease-out': true,

  // When hidden, use a single column (Editor takes full width)
  'grid-cols-1': !showPreview.value,

  // When visible, use two equal columns (Editor + Preview)
  'grid-cols-2 gap-xl': showPreview.value,
}))

// 3. Computed class for the Editor panel (always full width in its grid column)
const editorPanelClass = computed(() => ({
  // When preview is visible, both editor/preview share 1/2 span.
  'col-span-1 w-full': showPreview.value,
  // When preview is hidden, the editor uses the full grid space.
  'col-span-2 w-full': !showPreview.value,
}))

// 4. Function to toggle the preview
const togglePreview = () => {
  showPreview.value = !showPreview.value
}

const undoAction = () => {
  if (canUndo.value) {
    undo()
  }
}

const redoAction = () => {
  if (canRedo.value) {
    redo()
  }
}

/*defineShortcuts({
  // Save: Ctrl + S
  'meta_s': {
    handler: handleSave
  },

  // Undo: Ctrl + Z
  'meta_z': {
    handler: undoAction
  },

  // Ctrl + Shift + Z
  'meta_shift_z': {
    handler: redoAction
  },

  // Toggle Preview: Ctrl + P
  'meta_p': togglePreview
})*/
</script>

<template>
  <div class="mb-lg flex justify-between pr-8">

    <div class="flex items-center gap-sm">
      <UButton
        icon="lucide:rotate-ccw"
        label="Undo"
        variant="outline"
        color="neutral"
        :disabled="!canUndo"
        @click="undoAction"
      />
      <UButton
        icon="lucide:rotate-cw"
        label="Redo"
        variant="outline"
        color="neutral"
        :disabled="!canRedo"
        @click="redoAction"
      />
    </div>

    <div class="flex items-center gap-sm">
      <UButton
        :icon="showPreview ? 'lucide:eye-off' : 'lucide:eye'"
        :label="showPreview ? 'Hide Preview' : 'Show Preview'"
        variant="outline"
        color="neutral"
        @click="togglePreview"
      />
      <UButton
        icon="lucide:save"
        label="Save Post"
        color="primary"
        :loading="isSaving"
        @click="handleSave"
      />
    </div>
  </div>

  <div :class="gridClass">

    <div :class="editorPanelClass">
      <div class="pl-8">
        <RCBlockEditRenderer :blocks="blocks" />
      </div>
    </div>

    <div
      v-if="showPreview"
      class="col-span-1 w-full"
    >
      <RCBlockViewRenderer
        :blocks="blocks"
        class="transition duration-300 opacity-100"
      />
    </div>
  </div>
</template>

<style scoped></style>