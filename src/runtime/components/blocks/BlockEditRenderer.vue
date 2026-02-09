<script setup lang="ts">
import { type Component, watch } from "vue"
// @ts-ignore
import draggable from "vuedraggable"
import { getBlockEditorComponent } from "../../internal/blockMapper"
import type { Block } from "../../types"
import { tv } from "../../internal/tv"
import { useRC } from "../../composables"

export interface BlockEditRendererProps {
  blocks: Block[]
  containerId?: string | null // ID of the container block, null for root
  rc?: {
    root?: string
  }
}

const props = defineProps<BlockEditRendererProps>()
const { rc: rcProp, containerId = null } = props

const blocks = defineModel<Block[]>('blocks', { required: true })

export interface BlockEditRendererEmits {
  start: []
  end: []
  change: [any]
}

const emit = defineEmits<BlockEditRendererEmits>()

export interface BlockEditRendererSlots {}

const slots = defineSlots<BlockEditRendererSlots>()

const { rc } = useRC('BlockEditRenderer', rcProp)

const rendererId = Math.random().toString(36).substring(7)
console.log('[BlockEditRenderer] Instance created with ID:', rendererId, 'containerId:', containerId, 'initial blocks:', blocks.value.length)

const blockEditRendererStyles = tv({
  slots: {
    root: "flex flex-col w-full min-h-64 bg-neutral-50/50 rounded-lg transition-all"
  }
})

const { root } = blockEditRendererStyles()

// Watch blocks changes for debugging
watch(blocks, (newBlocks, oldBlocks) => {
  console.log(`[BlockEditRenderer ${rendererId}] Blocks changed:`, {
    oldCount: oldBlocks?.length || 0,
    newCount: newBlocks?.length || 0,
    blockIds: newBlocks?.map(b => ({ id: b.id, type: b.type }))
  })
}, { deep: true })

const getComponent = (block: Block): Component | null => {
  if (!block || !block.type || block.type.length === 0) {
    console.error("Block object is missing the critical 'type' field.")
    return null
  }

  const resolvedComponent = getBlockEditorComponent(block.type)

  if (!resolvedComponent) {
    console.error(`Component resolution failed for block type: ${block.type}`)
    return null
  }

  return resolvedComponent
}

const handleStart = () => {
  console.log(`[BlockEditRenderer ${rendererId}] Drag START - current blocks:`, blocks.value.length)
  emit('start')
}

const handleEnd = () => {
  console.log(`[BlockEditRenderer ${rendererId}] Drag END - current blocks:`, blocks.value.length)
  emit('end')
}

const handleChange = (event: any) => {
  console.log(`[BlockEditRenderer ${rendererId}] Drag CHANGE event:`, {
    event,
    added: event.added,
    removed: event.removed,
    moved: event.moved,
    currentBlocks: blocks.value.length,
    containerId,
    blockIds: blocks.value.map((b: any) => ({ id: b.id, type: b.type }))
  })
  
  // With shallowRef in container editors, vuedraggable modifies the actual 
  // block.props.children array directly, so the central state is already updated.
  // We just need to emit the change event for the parent to know something happened.
  
  if (event.added) {
    console.log(`[BlockEditRenderer ${rendererId}] Block ADDED to this container:`, event.added.element.id)
  }
  
  if (event.removed) {
    console.log(`[BlockEditRenderer ${rendererId}] Block REMOVED from this container:`, event.removed.element.id)
  }
  
  if (event.moved) {
    console.log(`[BlockEditRenderer ${rendererId}] Block MOVED within same container`)
  }
  
  emit('change', event)
}</script>

<template>
  <div :class="[root({ class: rc.root }), 'relative']">
    <div v-if="!blocks || blocks.length === 0" class="absolute inset-0 flex items-center justify-center pointer-events-none border-2 border-dashed border-neutral-200 rounded-lg">
      <div class="flex flex-col items-center gap-2 text-neutral-400">
        <UIcon name="lucide:arrow-down-to-line" class="size-6" />
        <span class="text-sm font-medium">Drop items here</span>
      </div>
    </div>
    
    <draggable
      v-model="blocks"
      item-key="id"
      handle=".drag-handle"
      :group="{ name: 'blocks', pull: true, put: true }"
      :animation="200"
      :force-fallback="true"
      fallback-class="drag-fallback"
      ghost-class="drag-placeholder"
      @start="handleStart"
      @end="handleEnd"
      @change="handleChange"
      class="flex flex-col gap-lg w-full min-h-32 flex-1 pb-32"
    >
      <template #item="{ element: block }">
        <div class="w-full">
          <template v-if="getComponent(block)">
            <RCBlock :id="block.id" :type="block.type" class="w-full">
              <component
                :is="getComponent(block)"
                :id="block.id"
                v-bind="block.props"
                :type="block.type"
                class="w-full"
              />
            </RCBlock>
          </template>
          <template v-else>
            <UAlert
              color="error"
              variant="subtle"
              icon="lucide:octagon-alert"
              title="Rendering Error"
              :description="`Block component for type '${block.type || 'UNKNOWN_OR_MISSING'}' was not found. This block will be skipped or the type is invalid/empty.`"
            />
          </template>
        </div>
      </template>
    </draggable>
  </div>
</template>

<style scoped>
:deep(.drag-placeholder) {
  opacity: 1;
  background: #3b82f6; /* blue-500 */
  height: 4px;
  border-radius: 2px;
  margin-top: 8px;
  margin-bottom: 8px;
  overflow: hidden;
}

:deep(.drag-fallback) {
  opacity: 0.9;
  transform: scale(1.01);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
  background-color: white; /* Ensure it has a background so it's not transparent */
  z-index: 9999; /* Ensure it's on top */
}

/* Hide children of the placeholder to just show the line */
:deep(.drag-placeholder > *) {
  display: none !important;
}
</style>
