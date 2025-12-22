<script setup lang="ts">
import { inject, ref, watch, onMounted, nextTick } from "vue"
import type { ParagraphBlockProps, RichTextContent } from "../../../types"
import { richTextToHtml, parseHtmlToRichText } from "../../../utils"

// The external dependencies
const editorApi = inject<any>("block-editor-api")

// 1. Define Props
const props = defineProps<ParagraphBlockProps & { id: string }>()

// 2. Local State for the Contenteditable Element
// We use a reference to the DOM element to read/write its content.
const editorRef = ref<HTMLElement | null>(null)

// Local buffer that holds the HTML representation of the content for initial render/sync
const localHtml = ref(richTextToHtml(props.text))

const isContentChanging = ref(false)

// --- Commit & Update Logic ---

/**
 * Commits the content of the editor to the global store on blur.
 */
const commitContentOnBlur = () => {
  if (!editorRef.value || !editorApi) return

  // 1. Get the content (using innerText to simulate plain text editing)
  const rawHtml = editorRef.value.innerText.trim()

  // 2. Only commit if the content has actually changed from the last known state
  const currentPropText = richTextToHtml(props.text)
  if (rawHtml === currentPropText) {
    return
  }

  // 3. Set a flag to ignore watcher updates briefly (defensive measure)
  isContentChanging.value = true

  // 4. Commit the structural update
  const newRichContent: RichTextContent = parseHtmlToRichText(rawHtml)
  editorApi.updateBlockProps(props.id, { text: newRichContent })

  // 5. Reset flag after commit
  nextTick(() => {
    isContentChanging.value = false
  })
}

// 3. Sync-In: Watch for external changes (undo/redo) and sync back to the editor
watch(
    () => props.text,
    (newContent) => {
      // Only sync back if the change is external AND the user is not actively typing
      if (isContentChanging.value || !editorRef.value || document.activeElement === editorRef.value) {
        return
      }

      const newHtml = richTextToHtml(newContent)

      // 💡 FIX: Manually update the DOM content, bypassing v-html
      if (editorRef.value.innerText !== newHtml) {
        editorRef.value.innerHTML = newHtml
        localHtml.value = newHtml // Update local state for future use
      }
    },
    { deep: true, immediate: true }
)

// Set the initial content when mounted (optional, handled by v-html but safer)
onMounted(() => {
  if (editorRef.value) {
    // 💡 FIX: Manually set content on mount. NO v-html in template.
    editorRef.value.innerHTML = localHtml.value
  }
})
</script>

<template>
  <div
    ref="editorRef"
    contenteditable="true"
    @blur="commitContentOnBlur"
    :class="[
        'p-2 outline-none min-h-6',
        'focus:ring-2 focus:ring-blue-500 rounded-md transition duration-150',
        'text-base'
      ]"
  ></div>
</template>

<style scoped></style>
