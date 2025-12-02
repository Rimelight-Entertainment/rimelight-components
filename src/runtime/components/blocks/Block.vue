<script setup lang="ts">
import { ref } from 'vue'

const {
  id
} = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  (e: 'moveBlockUp', id: string): void
  (e: 'moveBlockDown', id: string): void
  (e: 'addBlockAbove', id: string): void
  (e: 'addBlockBelow', id: string): void
  (e: 'duplicateBlock', id: string): void
  (e: 'deleteBlock', id: string): void
}>()

const handleMoveBlockUp = () => {
  emit('moveBlockUp', id)
  console.log(`Emitting 'moveBlockUp' for ID: ${id}`)
}

const handleMoveBlockDown = () => {
  emit('moveBlockDown', id)
  console.log(`Emitting 'moveBlockDown' for ID: ${id}`)
}

const handleAddBlockAbove = () => {
  emit('addBlockAbove', id)
  console.log(`Emitting 'addBlockAbove' for ID: ${id}`)
}

const handleAddBlockBelow = () => {
  emit('addBlockBelow', id)
  console.log(`Emitting 'addBlockBelow' for ID: ${id}`)
}

const handleDuplicateBlock = () => {
  emit('duplicateBlock', id)
  console.log(`Emitting 'duplicateBlock' for ID: ${id}`)
}

const handleDeleteBlock = () => {
  emit('deleteBlock', id)
  console.log(`Emitting 'deleteBlock' for ID: ${id}`)
}

const items = ref([
  [
    {
      icon: 'lucide:arrow-up',
      label: 'Move Block Up',
      click: handleMoveBlockUp,
    },
    {
      icon: 'lucide:arrow-down',
      label: 'Move Block Down',
      click: handleMoveBlockDown,
    }
  ],
  [
    {
      icon: 'lucide:corner-right-up',
      label: 'Add Block Above',
      click: handleAddBlockAbove,
    },
    {
      icon: 'lucide:corner-right-down',
      label: 'Add Block Below',
      click: handleAddBlockBelow,
    }
  ],
  [
    {
      icon: 'lucide:copy-plus',
      label: 'Duplicate Block',
      click: handleDuplicateBlock,
    },
    {
      color: 'error',
      icon: 'lucide:trash-2',
      label: 'Delete Block',
      click: handleDeleteBlock,
    }
  ]
])
</script>

<template>
  <div class="relative group">
    <div
      class=" absolute top-0 -ms-10 left-0
             z-10 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <UDropdownMenu
        :items="items"
      >
        <UButton icon="lucide:grip-vertical" variant="ghost" color="neutral"/>
      </UDropdownMenu>
    </div>

    <slot/>
  </div>
</template>

<style scoped>

</style>
