<script setup lang="ts">
import { type Component } from "vue"
import { getBlockEditorComponent } from "../../utils/blockMapper"
import type { Block } from "../../types/blocks"

const { blocks } = defineProps<{
  blocks: Block[]
}>()

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
  <div class="flex flex-col gap-lg">
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
          <RCBlock :id="block.id" :type="block.type">
            <component
              :is="getComponent(block)"
              :id="block.id"
              v-bind="block.props"
              :type="block.type"
              class="block-container"

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
