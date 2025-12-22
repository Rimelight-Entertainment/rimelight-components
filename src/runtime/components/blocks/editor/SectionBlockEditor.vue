<script setup lang="ts">
import { inject, ref, type Ref, computed, watch } from "vue"
import { type SectionBlockProps, type HeadingLevel } from "../../../types"
import { type SelectItem } from "@nuxt/ui/components/Select.vue"

const { level, title, description, children, id } = defineProps<
  SectionBlockProps & { id: string }
>()
const hasChildren = computed(() => children && children.length > 0)

const editorApi = inject<any>("block-editor-api")

const localLevel: Ref<HeadingLevel> = ref(level as HeadingLevel)
const localTitle = ref(title)
const localDescription = ref(description)

const levelItems: SelectItem[] = [
  { label: "H1", value: 1 },
  { label: "H2", value: 2 },
  { label: "H3", value: 3 }
]

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

watch(localLevel, (newLocalLevel) => {
  if (editorApi && id && newLocalLevel !== level) {
    editorApi.updateBlockProps(id, { level: newLocalLevel })
  }
})

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
    <RCSection :level="localLevel" :title="localTitle" :description="description" is-editing>
      <template #title>
        <div class="flex flex-row gap-xs">
          <USelect
            v-model="localLevel"
            :items="levelItems"
            value-key="value"
            label-key="label"
            variant="ghost"
            placeholder="Select Heading Level"
            size="sm"
            color="neutral"
          />
          <UInput
            :model-value="localTitle"
            variant="ghost"
            placeholder="Section Title..."
            @input="updateLocalTitle"
            @blur="commitTitleOnBlur"
            class="w-full"
          />
        </div>
      </template>
      <template #description>
        <UInput
          :model-value="localDescription"
          variant="ghost"
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
