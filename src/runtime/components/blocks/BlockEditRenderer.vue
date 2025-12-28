<script setup lang="ts">
import { type Component } from "vue"
import { getBlockEditorComponent } from "../../internal/blockMapper"
import type { Block } from "../../types"
import { tv } from "../../internal/tv"
import { useRC } from "../../composables/useRC"

export interface BlockEditRendererProps {
  blocks: Block[]
  rc?: {
    root?: string
  }
}

const { blocks, rc: rcProp } = defineProps<BlockEditRendererProps>()

export interface BlockEditRendererEmits {}

const emit = defineEmits<BlockEditRendererEmits>()

export interface BlockEditRendererSlots {}

const slots = defineSlots<BlockEditRendererSlots>()

const { rc } = useRC('BlockEditRenderer', rcProp)

const blockEditRendererStyles = tv({
  slots: {
    root: "flex flex-col gap-lg w-full"
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
      title="No blocks found for this page."
      description="It looks like there isn't any content added to this page yet."
    />
    <template v-else>
      <template v-for="block in blocks" :key="block.id">
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
      </template>
    </template>
  </div>
</template>
