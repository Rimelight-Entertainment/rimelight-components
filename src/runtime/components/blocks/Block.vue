<script setup lang="ts">
import { inject, computed, ref } from "vue"

const editorApi = inject<any>("block-editor-api")

if (!editorApi) {
  throw new Error("RCBlock must be used within a BlockEditor component")
}
const { id, type } = defineProps<{
  id: string
  type: string
}>()

const onDelete = () => editorApi.removeBlock(id)
const onDuplicate = () => editorApi.duplicateBlock(id)
const onMoveUp = () => editorApi.moveBlock(id, -1)
const onMoveDown = () => editorApi.moveBlock(id, 1)

const items = ref([
  [
    {
      icon: "lucide:arrow-up",
      label: "Move Block Up",
      click: onMoveUp
    },
    {
      icon: "lucide:arrow-down",
      label: "Move Block Down",
      click: onMoveDown
    }
  ],
  [
    {
      icon: "lucide:corner-right-up",
      label: "Add Block Above",
      //click: handleAddBlockAbove
    },
    {
      icon: "lucide:corner-right-down",
      label: "Add Block Below",
      //click: handleAddBlockBelow
    }
  ],
  [
    {
      icon: "lucide:copy-plus",
      label: "Duplicate Block",
      click: onDuplicate
    },
    {
      color: "error",
      icon: "lucide:trash-2",
      label: "Delete Block",
      click: onDelete
    }
  ]
])
</script>

<template>
  <div class="group relative pl-12 flex flex-row gap-xs">
    <div class="top-0 left-0 z-10 opacity-0 transition-opacity group-hover:opacity-100">
      <UDropdownMenu :items="items">
        <UButton icon="lucide:grip-vertical" variant="ghost" color="neutral" />
      </UDropdownMenu>
    </div>

    <slot />
  </div>
</template>

<style scoped></style>
