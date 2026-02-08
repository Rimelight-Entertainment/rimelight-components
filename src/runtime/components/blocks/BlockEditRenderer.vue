<script setup lang="ts">
import { type Component } from "vue"
import draggable from "vuedraggable"
import { getBlockEditorComponent } from "../../internal/blockMapper"
import type { Block } from "../../types"
import { tv } from "../../internal/tv"
import { useRC } from "../../composables"

export interface BlockEditRendererProps {
  blocks: Block[]
  rc?: {
    root?: string
  }
}

const { rc: rcProp } = defineProps<BlockEditRendererProps>()

const blocks = defineModel<Block[]>('blocks', { required: true })

export interface BlockEditRendererEmits {
  start: []
  end: []
}

const emit = defineEmits<BlockEditRendererEmits>()

export interface BlockEditRendererSlots {}

const slots = defineSlots<BlockEditRendererSlots>()

const { rc } = useRC('BlockEditRenderer', rcProp)

const blockEditRendererStyles = tv({
  slots: {
    root: "flex flex-col gap-lg w-full min-h-20"
  }
})

const { root } = blockEditRendererStyles()

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
</script>

<template>
  <div :class="root({ class: rc.root })">
    <UEmpty
      v-if="!blocks || blocks.length === 0"
      variant="naked"
      icon="lucide:blocks"
      title="No blocks"
      description="No content has been added yet."
    />
    <template v-else>
    <template v-else>
      <draggable
        v-model="blocks"
        item-key="id"
        handle=".drag-handle"
        ghost-class="opacity-50"
        @start="$emit('start')"
        @end="$emit('end')"
        :class="root({ class: rc.root })"
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
    </template>
  </div>
</template>
