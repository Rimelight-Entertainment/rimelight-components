<script setup lang="ts">
import { type Component, watch, ref, inject } from "vue";
import draggable from "vuedraggable/src/vuedraggable";
import type { Block } from "../../types";
import { tv } from "../../internal/tv";
import { useRC } from "../../composables";

export interface BlockEditRendererProps {
  blocks: Block[];
  containerId?: string | null;
  rc?: {
    root?: string;
  };
}

const props = defineProps<BlockEditRendererProps>();
const { rc: rcProp, containerId = null } = props;

const blocks = defineModel<Block[]>("blocks", { required: true });

export interface BlockEditRendererEmits {
  start: [];
  end: [];
  change: [any];
}

const emit = defineEmits<BlockEditRendererEmits>();

export interface BlockEditRendererSlots {}

const slots = defineSlots<BlockEditRendererSlots>();

const { rc } = useRC("BlockEditRenderer", rcProp);

const rendererId = Math.random().toString(36).substring(7);
console.log(
  "[BlockEditRenderer] Instance created with ID:",
  rendererId,
  "containerId:",
  containerId,
  "initial blocks:",
  blocks.value.length,
);

const editorApi = inject<any>("block-editor-api");

const isDraggingOver = ref(false);
const dragCounter = ref(0);

const onDragEnter = () => {
  dragCounter.value++;
  isDraggingOver.value = true;
};

const onDragLeave = () => {
  dragCounter.value--;
  if (dragCounter.value <= 0) {
    isDraggingOver.value = false;
    dragCounter.value = 0;
  }
};

const onDrop = () => {
  dragCounter.value = 0;
  isDraggingOver.value = false;
};

const blockEditRendererStyles = tv({
  slots: {
    root: "flex flex-col w-full min-h-32 transition-all border-l-2 border-neutral-200/50 p-4 pl-6 rounded-r-lg",
  },
  variants: {
    isDraggingOver: {
      true: {
        root: "border-l-4 border-primary-500 bg-primary-50/30 ring-1 ring-primary-500/10 z-10",
      },
    },
  },
});

const { root } = blockEditRendererStyles();

const handleStart = () => {
  console.log(
    `[BlockEditRenderer ${rendererId}] Drag START - current blocks:`,
    blocks.value.length,
  );
  emit("start");
};

const handleEnd = () => {
  console.log(`[BlockEditRenderer ${rendererId}] Drag END - current blocks:`, blocks.value.length);
  emit("end");
};

const handleChange = (event: any) => {
  console.log(`[BlockEditRenderer ${rendererId}] Drag CHANGE event:`, {
    event,
    added: event.added,
    removed: event.removed,
    moved: event.moved,
    currentBlocks: blocks.value.length,
    containerId,
    blockIds: blocks.value.map((b: any) => ({ id: b.id, type: b.type })),
  });

  // With shallowRef in container editors, vuedraggable modifies the actual
  // block.props.children array directly, so the central state is already updated.
  // We just need to emit the change event for the parent to know something happened.

  if (event.added) {
    console.log(
      `[BlockEditRenderer ${rendererId}] Block ADDED to this container:`,
      event.added.element.id,
    );
  }

  if (event.removed) {
    console.log(
      `[BlockEditRenderer ${rendererId}] Block REMOVED from this container:`,
      event.removed.element.id,
    );
  }

  if (event.moved) {
    console.log(`[BlockEditRenderer ${rendererId}] Block MOVED within same container`);
  }

  emit("change", event);
};
</script>

<template>
  <div
    :class="[root({ isDraggingOver }), rc.root, 'relative', { 'is-empty': blocks.length === 0 }]"
    @dragenter="onDragEnter"
    @dragover.prevent
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <draggable
      v-model="blocks"
      item-key="id"
      handle=".drag-handle"
      :group="{ name: 'blocks', pull: true, put: true }"
      :animation="200"
      :force-fallback="true"
      fallback-class="fallback"
      :ghost-class="blocks.length === 0 ? 'ghost-hidden' : 'ghost'"
      @change="handleChange"
      class="flex flex-col w-full flex-1"
      :class="[blocks && blocks.length > 0 ? 'gap-lg min-h-16 pb-32' : 'gap-0 min-h-32']"
    >
      <template #header>
        <div
          v-if="!blocks || blocks.length === 0"
          class="w-full p-4 flex items-center justify-center transition-all rounded-lg border-2 border-transparent"
          :class="[isDraggingOver ? 'bg-primary-50/50 border-dashed border-primary-500/50' : '']"
        >
          <UEmpty
            icon="i-lucide-layers"
            title="Empty Section"
            description="This area has no blocks yet. Drag items here or click to add your first block."
            variant="naked"
            class="w-full"
            :ui="{
              root: 'transition-transform px-4',
              title: isDraggingOver ? 'text-primary-600 font-bold' : '',
            }"
            :class="[isDraggingOver ? 'scale-[1.02]' : '']"
          >
            <template #actions>
              <UButton
                label="Add Block"
                icon="i-lucide-plus"
                color="neutral"
                variant="subtle"
                @click="editorApi?.openAddBlockModal()"
              />
            </template>
          </UEmpty>
        </div>
      </template>

      <template #item="{ element: block }">
        <div
          class="w-full relative [&.ghost]:bg-blue-500 [&.ghost]:h-1 [&.ghost]:min-h-0 [&.ghost]:my-2 [&.ghost]:rounded-sm [&.ghost]:overflow-hidden [&.ghost_>_*]:hidden [&.ghost-hidden]:hidden [&.fallback]:opacity-90 [&.fallback]:shadow-lg [&.fallback]:rounded-lg [&.fallback]:bg-white [&.fallback]:z-[9999] [&.fallback]:cursor-grabbing"
        >
          <RCBlock :id="block.id" :type="block.type" class="w-full">
            <component
              :is="block.type ? resolveComponent(`RC${block.type}Editor`) : 'div'"
              :id="block.id"
              v-bind="block.props"
              :type="block.type"
              class="w-full"
            />
          </RCBlock>
        </div>
      </template>
    </draggable>
  </div>
</template>
