<script setup lang="ts">
import { inject, ref, type Ref, computed, watch, nextTick, shallowRef } from "vue"
import { type SectionBlockProps, type HeadingLevel, type Block } from "../../../types"
import type { SelectItem } from "@nuxt/ui"
import { tv } from "../../../internal/tv"
import { useRC } from "../../../composables"
import { SECTION_LEVEL_KEY } from "../../../internal/injectionKeys"

export interface SectionBlockEditorProps extends SectionBlockProps {
  id: string
  rc?: {
    root?: string
    headerContainer?: string
    titleInput?: string
  }
}

const props = defineProps<SectionBlockEditorProps>()
const { rc: rcProp } = props

export interface SectionBlockEditorEmits {}

const emit = defineEmits<SectionBlockEditorEmits>()

export interface SectionBlockEditorSlots {}

const slots = defineSlots<SectionBlockEditorSlots>()

const { rc } = useRC('SectionBlockEditor', rcProp)

const sectionBlockEditorStyles = tv({
  slots: {
    root: "flex flex-col gap-sm",
    headerContainer: "flex flex-row items-center gap-xs",
    titleInput: "w-full"
  }
})

const { root, headerContainer, titleInput } = sectionBlockEditorStyles()

const editorApi = inject<any>("block-editor-api")

const localTitle = ref(props.title)
const localDescription = ref(props.description)

const parentLevel = inject(SECTION_LEVEL_KEY, computed(() => 1))
const currentLevel = computed(() => Math.min(6, parentLevel.value + 1))

watch(currentLevel, (newLevel) => {
  if (editorApi && props.id && newLevel !== props.level) {
    editorApi.updateBlockProps(props.id, { level: newLevel })
  }
}, { immediate: true })


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
  if (editorApi && props.id && localTitle.value !== props.title) {
    editorApi.updateBlockProps(props.id, { title: localTitle.value })
  }
}

const updateLocalDescription = (e: Event) => {
  localDescription.value = (e.target as HTMLInputElement).value
}

const commitDescriptionOnBlur = () => {
  if (editorApi && props.id && localDescription.value !== props.description) {
    editorApi.updateBlockProps(props.id, { description: localDescription.value })
  }
}


watch(
  () => props.title,
  (newVal) => {
    if (newVal !== localTitle.value) {
      localTitle.value = newVal
    }
  }
)


watch(
  () => props.description,
  (newVal) => {
    if (newVal !== localDescription.value) {
      localDescription.value = newVal
    }
  }
)

// Use a computed property to bridge vuedraggable and the central store directly
// This avoids maintaining a separate local state that can get out of sync
const localChildren = computed({
  get: () => props.children ?? [],
  set: (newChildren) => {
    if (editorApi && props.id) {
       // Deep copy to ensure we break references before sending to store
       const childrenCopy = JSON.parse(JSON.stringify(newChildren))
       editorApi.updateBlockProps(props.id, { children: childrenCopy })
    }
  }
})

// We no longer need to manually handle mutations since the setter does it immediately
const handleChildrenMutation = () => {
    // This might still be called by RCBlockEditor's events, but the work is done in the setter.
    // We can keep it empty or log for debugging.
    console.log('[SectionBlockEditor] Mutation event received (handled by setter)')
}</script>

<template>
  <div :class="root({ class: rc.root })">
    <RCSection :title="localTitle" :description="description" is-editing>
      <template #title>
        <div :class="headerContainer({ class: rc.headerContainer })">
          <span class="text-xs font-mono text-dimmed shrink-0 leading-none">
            H{{ currentLevel }}
          </span>
          <UInput
            :model-value="localTitle"
            variant="ghost"
            placeholder="Section Title..."
            @input="updateLocalTitle"
            @blur="commitTitleOnBlur"
            :class="titleInput({ class: rc.titleInput })"
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
        <RCBlockEditor 
          v-model="localChildren"
          :container-id="props.id"
          @mutation="handleChildrenMutation"
          @end="handleChildrenMutation"
        />
      </template>
    </RCSection>
  </div>
</template>
