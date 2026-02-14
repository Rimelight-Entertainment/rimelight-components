<script setup lang="ts">
import { type Component } from "vue"
import { getBlockRendererComponent } from "../../internal/blockMapper"
import type { Block } from "../../types"
import { tv } from "../../internal/tv"
import { useRC } from "../../composables"

export interface BlockViewRendererProps {
  blocks: Block[]
  rc?: {
    root?: string
  }
}

const { blocks, rc: rcProp } = defineProps<BlockViewRendererProps>()

export interface BlockViewRendererEmits {}

const emit = defineEmits<BlockViewRendererEmits>()

export interface BlockViewRendererSlots {}

const slots = defineSlots<BlockViewRendererSlots>()

const { rc } = useRC('BlockViewRenderer', rcProp)

const blockViewRendererStyles = tv({
  slots: {
    root: "flex flex-col gap-lg"
  }
})

const { root } = blockViewRendererStyles()

const getComponent = (block: Block): Component | null => {
  if (!block || !block.type || block.type.length === 0) {
    console.error("Block object is missing the critical 'type' field.")
    return null
  }

  const resolvedComponent = getBlockRendererComponent(block.type)

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
      <div v-for="block in blocks" :key="block.id">
        <component
          :is="getComponent(block)"
          v-if="getComponent(block)"
          :id="block.id"
          v-bind="block.props"
          :type="block.type"
          class="block-container"
        />
        <UAlert
          v-else
          color="error"
          variant="subtle"
          icon="lucide:octagon-alert"
          title="Rendering Error"
          :description="`Block component for type '${block.type || 'UNKNOWN_OR_MISSING'}' was not found. This block will be skipped or the type is invalid/empty.`"
        />
      </div>
    </template>
  </div>
</template>

<style scoped></style>
