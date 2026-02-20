<script setup lang="ts">
import { inject, ref } from "vue";
import { tv } from "../../internal/tv";
import { useRC } from "../../composables";

export interface BlockProps {
  id: string;
  type: string;
  rc?: {
    root?: string;
    menuContainer?: string;
  };
}

const { id, type, rc: rcProp } = defineProps<BlockProps>();

export interface BlockEmits {}

const emit = defineEmits<BlockEmits>();

export interface BlockSlots {
  default: (props: {}) => any;
}

const slots = defineSlots<BlockSlots>();

const { rc } = useRC("Block", rcProp);

const blockStyles = tv({
  slots: {
    root: "group relative pl-12 flex flex-row gap-xs",
    menuContainer: "top-0 left-0 z-10 opacity-0 transition-opacity group-hover:opacity-100",
  },
});

const { root, menuContainer } = blockStyles();

const editorApi = inject<any>("block-editor-api");

if (!editorApi) {
  throw new Error("RCBlock must be used within a BlockEditor component");
}

const onDelete = () => editorApi.removeBlock(id);
const onDuplicate = () => editorApi.duplicateBlock(id);
const onMoveUp = () => editorApi.moveBlock(id, -1);
const onMoveDown = () => editorApi.moveBlock(id, 1);

const onAddAbove = () => editorApi.openAddBlockModal(id, "before");
const onAddBelow = () => editorApi.openAddBlockModal(id, "after");

const items = ref([
  [
    {
      icon: "lucide:arrow-up",
      label: "Move Block Up",
      onSelect: onMoveUp,
    },
    {
      icon: "lucide:arrow-down",
      label: "Move Block Down",
      onSelect: onMoveDown,
    },
  ],
  [
    {
      icon: "lucide:corner-right-up",
      label: "Add Block Above",
      onSelect: onAddAbove,
    },
    {
      icon: "lucide:corner-right-down",
      label: "Add Block Below",
      onSelect: onAddBelow,
    },
  ],
  [
    {
      icon: "lucide:copy-plus",
      label: "Duplicate Block",
      onSelect: onDuplicate,
    },
    {
      color: "danger",
      icon: "lucide:trash-2",
      label: "Delete Block",
      onSelect: onDelete,
    },
  ],
]);
</script>

<template>
  <div :class="root({ class: rc.root })">
    <div :class="menuContainer({ class: rc.menuContainer })">
      <UDropdownMenu :items="items">
        <UButton
          icon="lucide:grip-vertical"
          variant="ghost"
          color="neutral"
          class="drag-handle cursor-grab active:cursor-grabbing"
        />
      </UDropdownMenu>
    </div>

    <slot />
  </div>
</template>

<style scoped></style>
