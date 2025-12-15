<script setup lang="ts">
import { inject, ref, watch, onMounted, nextTick } from "vue"
import type { ParagraphBlockProps, RichTextContent } from "../../../types/blocks"
import { richTextToHtml, parseHtmlToRichText } from "../../../utils/richTextHelpers"

// The external dependencies
const editorApi = inject<any>("block-editor-api")

// 1. Define Props
const props = defineProps<ParagraphBlockProps & { id: string }>()

// 2. Local State for the Contenteditable Element
// We use a reference to the DOM element to read/write its content.
const editorRef = ref<HTMLElement | null>(null)

// Local buffer that holds the HTML representation of the content for initial render/sync
const localHtml = ref(richTextToHtml(props.text))

// --- Commit & Update Logic ---

/**
 * Handles the input event (optional, for real-time local updates if needed)
 */
const updateLocalContent = (e: Event) => {
  // For a basic contenteditable, we often rely on the DOM itself for the source of truth
  // and only update the local variable if complex logic is involved.
  if (editorRef.value) {
    localHtml.value = editorRef.value.innerHTML
  }
}

/**
 * Commits the content of the editor to the global store on blur.
 */
const commitContentOnBlur = () => {
  if (!editorRef.value || !editorApi) return

  const rawHtml = editorRef.value.innerText.trim() // Get plain text content for simplicity

  // Only commit if the content has actually changed from the last known state (prop text content)
  const currentPropText = richTextToHtml(props.text)
  if (rawHtml === currentPropText) {
    return
  }

  // Parse the raw input back into the RichTextContent structure
  const newRichContent: RichTextContent = parseHtmlToRichText(rawHtml)

  // Commit the structural update
  editorApi.updateBlockProps(props.id, { text: newRichContent })
}

// 3. Sync-In: Watch for external changes (undo/redo) and sync back to the editor
watch(
  () => props.text,
  (newContent) => {
    const newHtml = richTextToHtml(newContent)

    // Only update if the content has actually changed and the editor is not currently focused
    // We trust the DOM to have the correct state if focused.
    if (editorRef.value && document.activeElement !== editorRef.value) {
      localHtml.value = newHtml
      editorRef.value.innerHTML = newHtml // Force DOM update for contenteditable
    }
  },
  { deep: true, immediate: true }
)

// Set the initial content when mounted (optional, handled by v-html but safer)
onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = localHtml.value
  }
})
</script>

<template>
    <div
      ref="editorRef"
      contenteditable="true"
      @input="updateLocalContent"
      @blur="commitContentOnBlur"
      :class="[
        'p-2 outline-none min-h-6',
        'focus:ring-2 focus:ring-blue-500 rounded-md transition duration-150',
        'text-base' // Apply your typography styles here
      ]"
      v-html="localHtml"
    >
    </div>
</template>

<style scoped>

</style>