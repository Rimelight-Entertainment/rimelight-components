<script setup lang="ts">
import { inject, ref, watch } from "vue"
import type { TestBlockProps } from "../../../types/blocks"

const { text, id } = defineProps<TestBlockProps & { id: string }>()

const editorApi = inject<any>("block-editor-api")

const localText = ref(text)

/**
 * Updates the local buffer on every keystroke.
 * This is fast and maintains focus stability.
 */
const updateLocalText = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  localText.value = val
}

/**
 * Commits the final local value to the global block store when the input loses focus.
 * This triggers the singular, delayed V-DOM reconciliation cycle.
 */
const commitOnBlur = () => {
  if (editorApi && id) {
    // Only commit if the local value is actually different from the current prop value
    // to prevent unnecessary mutations and history entries if nothing changed.
    if (localText.value !== text) {
      editorApi.updateBlockProps(id, { text: localText.value })
    }
  }
}

// 4. Watch for external changes (e.g., undo/redo, external data load)
// This ensures the local buffer syncs back if the prop changes without a blur event.
watch(
  () => text,
  (newVal) => {
    // Only update the local value if it differs from the incoming prop value.
    // This is the clean way to sync external changes without interference.
    if (newVal !== localText.value) {
      localText.value = newVal
    }
  },
  // Ensure the initial state is set correctly
  { immediate: true }
)
</script>

<template>
  <RCTest :text="localText">
    <template #content>
      <UInput
        :model-value="localText"
        placeholder="Type here..."
        @input="updateLocalText"
        @blur="commitOnBlur"
        class="w-full"
      />
    </template>
  </RCTest>
</template>

<style scoped></style>