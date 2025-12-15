<script setup lang="ts">
import { inject, ref, computed, watch } from "vue"
import type { SectionBlockProps } from "../../../types/blocks"

const { level, title, description, children, id } = defineProps<
  SectionBlockProps & { id: string }
>()
const hasChildren = computed(() => children && children.length > 0)

const editorApi = inject<any>("block-editor-api")

const localLevel = ref(level)
const localTitle = ref(title)
const localDescription = ref(description)

/**
 * Commits the new level immediately on change (dropdown commitment).
 */
const commitLevelOnChange = (e: Event) => {
  const newVal = parseInt((e.target as HTMLSelectElement).value)
  localLevel.value = newVal

  if (editorApi && id && newVal !== level) {
    editorApi.updateBlockProps(id, { level: newVal })
  }
}

/**
 * Updates the local title buffer on every keystroke for instant feedback.
 */
const updateLocalTitle = (e: Event) => {
  localTitle.value = (e.target as HTMLInputElement).value
}

/**
 * Commits the final local title value to the global store when the input loses focus.
 */
const commitTitleOnBlur = () => {
  if (editorApi && id && localTitle.value !== title) {
    editorApi.updateBlockProps(id, { title: localTitle.value })
  }
}

const updateLocalDescription = (e: Event) => {
  localDescription.value = (e.target as HTMLInputElement).value
}

const commitDescriptionOnBlur = () => {
  if (editorApi && id && localDescription.value !== description) {
    editorApi.updateBlockProps(id, { description: localDescription.value })
  }
}

watch(
  () => title,
  (newVal) => {
    if (newVal !== localTitle.value) {
      localTitle.value = newVal
    }
  }
)

watch(
  () => level,
  (newVal) => {
    if (newVal !== localLevel.value) {
      localLevel.value = newVal
    }
  }
)

watch(
  () => description,
  (newVal) => {
    if (newVal !== localDescription.value) {
      localDescription.value = newVal
    }
  }
)
</script>

<template>
  <div class="flex flex-col gap-sm">
    <select
      :value="localLevel"
      @change="commitLevelOnChange"
      class="rounded border-none bg-gray-100 p-1 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-blue-500"
    >
      <option :value="1">H1</option>
      <option :value="2">H2</option>
      <option :value="3">H3</option>
    </select>

    <RCSection
      :level="localLevel"
      :title="localTitle"
      :description="description"
      is-editing
    >
      <template #title>
        <UInput
          :model-value="localTitle"
          placeholder="Section Title..."
          @input="updateLocalTitle"
          @blur="commitTitleOnBlur"
        />
      </template>
      <template #description>
        <UInput
          :model-value="description"
          placeholder="Section Description..."
          @input="updateLocalDescription"
          @blur="commitDescriptionOnBlur"
        />
      </template>
      <template #default>
        <RCBlockEditRenderer v-if="hasChildren" :blocks="children" />
      </template>
    </RCSection>
  </div>
</template>
