<script setup lang="ts">
import { type Component } from "vue";
import type { Block } from "../../types";
import { tv } from "../../internal/tv";
import { useRC } from "../../composables";

export interface BlockViewRendererProps {
  blocks: Block[];
  rc?: {
    root?: string;
  };
}

const { blocks, rc: rcProp } = defineProps<BlockViewRendererProps>();

export interface BlockViewRendererEmits {}

const emit = defineEmits<BlockViewRendererEmits>();

export interface BlockViewRendererSlots {}

const slots = defineSlots<BlockViewRendererSlots>();

const { rc } = useRC("BlockViewRenderer", rcProp);

const blockViewRendererStyles = tv({
  slots: {
    root: "flex flex-col gap-lg",
  },
});

const { root } = blockViewRendererStyles();
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
      <div v-for="block in (blocks || []).filter((b) => !!b)" :key="block.id">
        <component
          :is="block.type ? resolveComponent(`RC${block.type}Renderer`) : 'div'"
          :id="block.id"
          v-bind="block.props"
          :type="block.type"
          class="block-container"
        />
      </div>
    </template>
  </div>
</template>

<style scoped></style>
