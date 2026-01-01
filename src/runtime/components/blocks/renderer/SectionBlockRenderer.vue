<script setup lang="ts">
import { computed } from "vue"
import type { SectionBlockProps } from "../../../types"
import { slugify } from "../../../utils"
import { tv } from "../../../internal/tv"
import { useRC } from "../../../composables"

export interface SectionBlockRendererProps extends SectionBlockProps {
  rc?: {
    root?: string
  }
}

const { level, title, description, children, rc: rcProp } = defineProps<SectionBlockRendererProps>()

export interface SectionBlockRendererEmits {}

const emit = defineEmits<SectionBlockRendererEmits>()

export interface SectionBlockRendererSlots {}

const slots = defineSlots<SectionBlockRendererSlots>()

const { rc } = useRC('SectionBlockRenderer', rcProp)

const sectionBlockRendererStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = sectionBlockRendererStyles()

const headingId = computed(() => (title ? slugify(title) : undefined))
const hasChildren = computed(() => children && children.length > 0)
</script>

<template>
  <div :class="root({ class: rc.root })">
    <RCSection :level="level" :title="title" :description="description" :id="headingId">
      <RCBlockViewRenderer v-if="hasChildren" :blocks="children" />
    </RCSection>
  </div>
</template>
